import { json } from '@sveltejs/kit';
import sql from 'mssql';
import { executeQuery } from '$lib/server/database';
import { strftime } from '$lib/utils/date-utils';

export async function GET({ url }) {
	const startDate = url.searchParams.get('startDate') ?? strftime('%F');
	const endDate = url.searchParams.get('endDate') ?? strftime('%F');
	const bookingId = url.searchParams.get('bookingId');
	const keyword = url.searchParams.get('keyword');
	const user = url.searchParams.get('user');

	let cond = 'WHERE ';
	let joiner = '';
	let params = {};

	// Helper function to append condition
	function appendCondition(condition) {
		if (condition) {
			cond += joiner + condition;
			joiner = ' AND ';
		}
	}

	// Add conditions based on user inputs
	appendCondition(bookingId && `BookingID=@bookingId`);
	if (bookingId) params.bookingId = { value: bookingId };

	appendCondition(keyword && `remarks LIKE @keyword`);
	if (keyword) params.keyword = { value: `%${keyword}%` };

	appendCondition(user && `UserID=@user`);
	if (user) params.user = { value: user };

	try {
		if (startDate && endDate) {
			appendCondition(
				`CONVERT(datetime, CONVERT(varchar(10), DATEADD(day, 0, TimeStamp), 112)) 
				 BETWEEN @startDate AND @endDate`
			);
			params.startDate = { type: sql.Date, value: startDate };
			params.endDate = { type: sql.Date, value: endDate };
		} else if (!bookingId && !keyword) {
			const pastYearDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
			const currentDate = new Date();
			appendCondition(
				`CONVERT(datetime, CONVERT(varchar(10), DATEADD(day, 0, TimeStamp), 112)) 
				 BETWEEN @pastYearDate AND @currentDate`
			);
			params.pastYearDate = { type: sql.Date, value: pastYearDate };
			params.currentDate = { type: sql.Date, value: currentDate };
		}

		const query = `SELECT * FROM log ${cond} ORDER BY TimeStamp DESC, BookingID, RoomID`;
		console.log(query);
		const result = await executeQuery(query, params);

		return json(result);
	} catch (err) {
		console.error(err);
		return json({ error: err.message });
	}
}
