import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../mssql.config';
import { strftime } from '$lib/utils/date-utils';

export async function GET({ url }) {
	const startDate = url.searchParams.get('startDate') ?? new Date(strftime('%F'));
	const endDate = url.searchParams.get('endDate') ?? new Date(strftime('%F'));
	const bookingId = url.searchParams.get('bookingId');
	const keyword = url.searchParams.get('keyword');
	const user = url.searchParams.get('user');

	let cond = '';
	let joiner = ' WHERE ';

	// Helper function to append condition
	function appendCondition(condition) {
		if (condition) {
			cond += joiner + condition;
			joiner = ' AND '; // Update joiner after the first condition is added
		}
	}

	// Add conditions based on user inputs
	appendCondition(bookingId && `BookingID='${bookingId}'`);
	appendCondition(keyword && `remarks LIKE '%${keyword}%'`);
	appendCondition(user && `UserID='${user}'`);

	try {
		let pool = await sql.connect(config);

		let request = pool.request();

		if (startDate && endDate) {
			appendCondition(
				`CONVERT(datetime, CONVERT(varchar(10), DATEADD(day, 0, TimeStamp), 112)) BETWEEN @startDate AND @endDate`
			);
			request.input('startDate', sql.DateTime, new Date(startDate));
			request.input('endDate', sql.DateTime, new Date(endDate));
		} else if (!bookingId && !keyword) {
			const pastYearDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
			const currentDate = new Date();
			appendCondition(
				`CONVERT(datetime, CONVERT(varchar(10), DATEADD(day, 0, TimeStamp), 112)) BETWEEN @pastYearDate AND @currentDate`
			);
			request.input('pastYearDate', sql.DateTime, pastYearDate);
			request.input('currentDate', sql.DateTime, currentDate);
		}

		let query = `SELECT * FROM log ${cond} ORDER BY TimeStamp DESC, BookingID, RoomID`;
		console.log(query);
		let result = await request.query(query);

		return json(result.recordset);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
