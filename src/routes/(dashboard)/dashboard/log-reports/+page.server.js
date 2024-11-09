import { redirect } from '@sveltejs/kit';
import { strftime } from '$lib/utils/date-utils';

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

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, actionData }) {
	let startDate = url.searchParams.get('startDate') ?? strftime('%F');
	let endDate = url.searchParams.get('endDate') ?? strftime('%F');
	const bookingId = url.searchParams.get('bookingId');
	const keyword = url.searchParams.get('keyword');
	const user = url.searchParams.get('user');

	const [logReport, users] = await Promise.all([
		getLogReport(startDate, endDate, bookingId, keyword, user, url.origin),
		fetch(url.origin + '/api/common/getUsers').then(response => response.json())
	]);

	console.log({ startDate, endDate, bookingId, keyword, user });

	return {
		logReport,
		users,
		startDate,
		endDate,
		bookingId,
		keyword,
		selectedUser: user
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

		throw redirect(303, `${url.pathname}?${new URLSearchParams({
			startDate,
			endDate,
			bookingId,
			keyword,
			user
		})}`);
	}
};
