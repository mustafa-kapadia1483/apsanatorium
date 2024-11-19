import { strftime } from '$lib/utils/date-utils';

const mapDebitCreditGstReportData = (item, index) => {
	return {
		"#": index + 1,
		"ID": item.DCID,
		"Date": strftime('%d-%b-%Y', new Date(item.DCDate)),
		"EJamaat ID": item.eJamaatID,
		"Name": item.FullName,
		"Booking ID": item.bookingId,
		"Sub Total": item.SubAmount,
		"Tax": item.TaxAmount,
		"Total Amount": item.TotalAmount,
		"User": item.UserID
	}
}

const TABLE_HEADERS = [
	"#",
	"ID",
	"Date",
	"EJamaat ID",
	"Name",
	"Booking ID",
	"Sub Total",
	"Tax",
	"Total Amount",
	"User"
];

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	let startDate = url.searchParams.get('startDate');
	let endDate = url.searchParams.get('endDate');
	let reportType = url.searchParams.get('reportType');

	if (!startDate || !endDate || !reportType) {
		return {
			startDate: strftime('%F'),
			endDate: strftime('%F'),
			debitCreditGstReportData: null,
			tableHeaders: TABLE_HEADERS,
			reportType: "Credit"
		};
	}

	const debitCreditGstReportData = await fetch(`${url.origin}/api/reports/debit-credit-gst-report?${new URLSearchParams({
		startDate,
		endDate,
		reportType
	})}`
	).then(res => res.json());

	const records = debitCreditGstReportData.records.map(mapDebitCreditGstReportData);

	// Add total amount row so that it can be exported to excel & shown in the table
	if (records.length > 0) {
		records.push({
			"#": "",
			"ID": "",
			"Date": "",
			"EJamaat ID": "",
			"Name": "",
			"Booking ID": "Total",
			"Sub Total": debitCreditGstReportData.totals.SubAmount,
			"Tax": debitCreditGstReportData.totals.TaxAmount,
			"Total Amount": debitCreditGstReportData.totals.TotalAmount,
			"User": ""
		});
	}

	return {
		startDate,
		endDate,
		debitCreditGstReportData: records,
		tableHeaders: TABLE_HEADERS,
		reportType
	};
}
