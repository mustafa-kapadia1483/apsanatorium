import { strftime, getOneMonthAgo } from '$lib/utils/date-utils';

const mapNonAdjustedAdvancesReport = (item, index) => {
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
			nonAdjustedAdvancesReport: null,
			tableHeaders: TABLE_HEADERS
		};
	}

	const nonAdjustedAdvancesReport = await fetch(`${url.origin}/api/reports/non-adjusted-advances-amount-report?${new URLSearchParams({
		startDate,
		endDate,
	})}`
	).then(res => res.json());

	const records = nonAdjustedAdvancesReport.records.map(mapNonAdjustedAdvancesReport);

	// Add total amount row so that it can be exported to excel & shown in the table
	if (records.length > 0) {
		records.push({
			"#": "",
			"Booking ID": "Total",
			"Total Advance": nonAdjustedAdvancesReport.totals.Advance,
			"Adjusted Advance": nonAdjustedAdvancesReport.totals.AdvanceAdj,
			"Balance": nonAdjustedAdvancesReport.totals.Balance
		});
	}

	return {
		startDate,
		endDate,
		nonAdjustedAdvancesReportData: records,
		tableHeaders: TABLE_HEADERS
	};
}
