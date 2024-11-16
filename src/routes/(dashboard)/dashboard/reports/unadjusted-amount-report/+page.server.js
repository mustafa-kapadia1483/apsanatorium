import { strftime, getOneMonthAgo } from '$lib/utils/date-utils';

const mapUnAdjustedAdvancesReport = (item, index) => {
	return {
		"#": index + 1,
		"Booking ID": item.BookingID,
		"Total Advance": item.Advance,
		"Adjusted Advance": item.AdvanceAdj,
		"Balance": item.Balance
	}
}

const TABLE_HEADERS = [
	"#",
	"Booking ID",
	"Total Advance",
	"Adjusted Advance",
	"Balance",
];

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	let startDate = url.searchParams.get('startDate');
	let endDate = url.searchParams.get('endDate');

	if (!startDate || !endDate) {
		return {
			startDate: strftime('%F', getOneMonthAgo()),
			endDate: strftime('%F'),
			unAdjustedAdvancesReport: null,
			tableHeaders: TABLE_HEADERS
		};
	}

	const unAdjustedAdvancesReport = await fetch(`${url.origin}/api/reports/unadjusted-amount-report?${new URLSearchParams({
		startDate,
		endDate,
	})}`
	).then(res => res.json());

	const records = unAdjustedAdvancesReport.records.map(mapUnAdjustedAdvancesReport);

	// Add total amount row so that it can be exported to excel & shown in the table
	if (records.length > 0) {
		records.push({
			"#": "",
			"Booking ID": "Total",
			"Total Advance": unAdjustedAdvancesReport.totals.Advance,
			"Adjusted Advance": unAdjustedAdvancesReport.totals.AdvanceAdj,
			"Balance": unAdjustedAdvancesReport.totals.Balance
		});
	}

	return {
		startDate,
		endDate,
		unAdjustedAdvancesReportData: records,
		tableHeaders: TABLE_HEADERS
	};
}
