import { error, redirect } from '@sveltejs/kit';
import sql from 'mssql';
import config from '../../../../../mssql.config';
import { strftime } from '$lib/utils/date-utils';

let logReport = [];

async function getLogReport(startDate, endDate, bookingId, keyword, user) {
	try {
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

		const query = `SELECT * FROM log ${cond} ORDER BY TimeStamp DESC, BookingID, RoomID`;
		const result = await request.query(query);

		const logReportArray = result.recordset.map(({ TimeStamp, ...rest }) => {
			return {
				TimeStamp: strftime('%d-%b-%Y %I:%M %p', new Date(TimeStamp)),
				...rest
			};
		});

		return {
			logReportArray
		};
	} catch (err) {
		return {
			error: err.message
		};
	}
}

function getDateRange(type) {
	const today = new Date();
	let startDate, endDate;

	switch (type) {
		case 'today':
			startDate = today;
			endDate = today;
		case 'this-month':
			startDate = new Date(today.getFullYear(), today.getMonth(), 1);
			endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of this month
			break;

		case 'last-month':
			startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
			endDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month
			break;

		case 'this-financial-year':
			startDate = new Date(
				today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1,
				3,
				1
			); // Financial year starts in April
			endDate = today; // Until today's date
			break;

		case 'last-financial-year':
			startDate = new Date(
				today.getMonth() >= 3 ? today.getFullYear() - 1 : today.getFullYear() - 2,
				3,
				1
			);
			endDate = new Date(
				today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1,
				2,
				31
			); // End of March for the last financial year
			break;
		case 'last-30-days':
			startDate = new Date(today);
			startDate.setDate(today.getDate() - 30); // 30 days ago
			endDate = today; // Today's date
			break;

		default:
			throw new Error('Invalid type provided.');
	}

	return {
		startDate: startDate.toISOString().split('T')[0],
		endDate: endDate.toISOString().split('T')[0]
	};
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, actionData }) {
	const startDate = url.searchParams.get('startDate') ?? new Date(strftime('%F'));
	const endDate = url.searchParams.get('endDate') ?? new Date(strftime('%F'));
	const bookingId = url.searchParams.get('bookingId');
	const keyword = url.searchParams.get('keyword');
	const user = url.searchParams.get('user');

	if (logReport.length == 0) {
		logReport = await getLogReport(startDate, endDate, bookingId, keyword, user);
	}

	return {
		...logReport
	};
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		let startDate = formData.get('startDate');
		let endDate = formData.get('endDate');
		const bookingId = formData.get('bookingId');
		const keyword = formData.get('keyword');
		const user = formData.get('user');
		const timeframe = formData.get('timeframe');

		console.log('timeframe', timeframe);
		if (timeframe) {
			const dateRange = getDateRange(timeframe);
			startDate = dateRange.startDate;
			endDate = dateRange.endDate;
		}

		logReport = await getLogReport(startDate, endDate, bookingId, keyword, user);

		return {
			data: undefined
		};
	}
};
