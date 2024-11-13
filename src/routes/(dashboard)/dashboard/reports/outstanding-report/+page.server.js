import { strftime } from '$lib/utils/date-utils';

const mapOutstandingReportData = (item, index) => {
	return {
		"#": index + 1,
		"EJamaat ID": item.eJamaatID,
		"Name": item.FullName,
		"Booking ID": item.BookingID,
		"Stay Record ID": item.StayRecID,
		"Stay Record Date": strftime('%d-%b-%Y', new Date(item.StayRecDate)),
		"Total Amount(A)": item["Final Amount"],
		"Total Tax(B)": item["Final Tax"],
		"Paid Amount(C)": item["Paid Amt"],
		"Paid Tax(D)": item["Paid Tax Amt"],
		"Outstanding Amount(A + B) - (C + D)": item["Balance"]
	}
}

const TABLE_HEADERS = [
	"#",
	"EJamaat ID",
	"Name",
	"Booking ID",
	"Stay Record ID",
	"Stay Record Date",
	"Total Amount(A)",
	"Total Tax(B)",
	"Paid Amount(C)",
	"Paid Tax(D)",
	"Outstanding Amount(A + B) - (C + D)"
];

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const bookingId = url.searchParams.get('bookingId');

	if (bookingId == null) {
		return {
			bookingId: "",
			outstandingReportData: null,
		};
	}

	const outstandingReportData = await fetch(`${url.origin}/api/reports/outstanding-report?${new URLSearchParams({
		bookingId
	})}`
	).then(res => res.json());

	const records = outstandingReportData.records.map(mapOutstandingReportData);

	// Add total amount row so that it can be exported to excel & shown in the table
	if (records.length > 0) {
		records.push({
			"#": "",
			"EJamaat ID": "",
			"Name": "",
			"Booking ID": "",
			"Stay Record ID": "",
			"Stay Record Date": "Total",
			"Total Amount(A)": outstandingReportData.totals["Final Amount"],
			"Total Tax(B)": outstandingReportData.totals["Final Tax"],
			"Paid Amount(C)": outstandingReportData.totals["Paid Amt"],
			"Paid Tax(D)": outstandingReportData.totals["Paid Tax Amt"],
			"Outstanding Amount(A + B) - (C + D)": outstandingReportData.totals["Balance"]
		});
	}

	return {
		bookingId,
		outstandingReportData: records,
		tableHeaders: TABLE_HEADERS
	};
}
