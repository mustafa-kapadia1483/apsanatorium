import { error, redirect } from '@sveltejs/kit';
import sql from 'mssql';
import config from '../../../../../mssql.config';
import { strftime } from '$lib/utils/date-utils';

let logReport = null;
let users = [];

async function getLogReport(startDate, endDate, bookingId, keyword, user, origin) {
	try {
		const url = new URL('/api/log-report', origin);
		
		// Add query parameters if they exist
		if (startDate) url.searchParams.set('startDate', startDate);
		if (endDate) url.searchParams.set('endDate', endDate);
		if (bookingId) url.searchParams.set('bookingId', bookingId);
		if (keyword) url.searchParams.set('keyword', keyword);
		if (user) url.searchParams.set('user', user);

		const response = await fetch(url);
		const result = await response.json();

		if (!Array.isArray(result)) {
			throw new Error('Invalid response from server');
		}

		const logReportArray = result.map(({ TimeStamp, ...rest }) => {
			return {
				TimeStamp: strftime('%d-%b-%Y %I:%M %p', new Date(TimeStamp)),
				...rest
			};
		});

		return logReportArray;

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

	if (!logReport) {
		[logReport, users] = await Promise.all([
			getLogReport(startDate, endDate, bookingId, keyword, user, url.origin),
			fetch(url.origin + '/api/common/getUsers').then(response => response.json())
		]);
	}

	return {
		logReport,
		users
	};
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request, url }) => {
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

		logReport = await getLogReport(startDate, endDate, bookingId, keyword, user, url.origin);

		return {
			data: undefined
		};
	}
};
