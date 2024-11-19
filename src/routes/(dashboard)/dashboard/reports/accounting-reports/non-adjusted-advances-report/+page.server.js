import { strftime, getOneMonthAgo } from '$lib/utils/date-utils';

const mapNonAdjustedAdvancesReport = (item) => {
	return {
		"Guest Name": `${item.fullname} (${item.ejamaatID})`,
		"Rpt Date": strftime('%d-%b-%Y', new Date(item.OCDate)),
		"RptID": item.OCID,
		"Bkg ID": item.BookingID,
		"Total Advance Collected (inclusive of tax)": item.TotAdvance,
		"Unadjusted Advance": item.UnAdjAmt,
		"Unadjusted Advance Tax": item.UnAdjAmtTax,
		"Total Unadjusted Amount": item.TotUnAdjAmt
	}
}

const TABLE_HEADERS = [
	"Guest Name",
	"Rpt Date",
	"RptID",
	"Bkg ID",
	"Total Advance Collected (inclusive of tax)",
	"Unadjusted Advance",
	"Unadjusted Advance Tax",
	"Total Unadjusted Amount"
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

	const nonAdjustedAdvancesReport = await fetch(`${url.origin}/api/reports/accounting-reports/non-adjusted-advances-report?${new URLSearchParams({
		startDate,
		endDate,
	})}`
	).then(res => res.json());

	const records = nonAdjustedAdvancesReport.records.map(mapNonAdjustedAdvancesReport);

	// Add total amount row so that it can be exported to excel & shown in the table
	if (records.length > 0) {
		records.push({
			"Guest Name": "",
			"Rpt Date": "",
			"RptID": "",
			"Bkg ID": "Total",
			"Total Advance Collected (inclusive of tax)": nonAdjustedAdvancesReport.totals.TotAdvance,
			"Unadjusted Advance": nonAdjustedAdvancesReport.totals.UnAdjAmt,
			"Unadjusted Advance Tax": nonAdjustedAdvancesReport.totals.UnAdjAmtTax,
			"Total Unadjusted Amount": nonAdjustedAdvancesReport.totals.TotUnAdjAmt
		});
	}

	return {
		startDate,
		endDate,
		nonAdjustedAdvancesReportData: records,
		tableHeaders: TABLE_HEADERS
	};
}
