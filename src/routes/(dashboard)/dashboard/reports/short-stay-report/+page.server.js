import { strftime } from '$lib/utils/date-utils';

const mapShortStayReportData = (item, index) => {
	return {
		"#": index + 1,
		"EJamaat ID": item.eJamaatID,
		"Name": item.FullName,
		"Booking ID": item.BookingID,
		"Stay ID": item.StayRecID,
		"Date": strftime('%d-%b-%Y', new Date(item.StayRecDate)),
		"Total Room Rent": item["Total Room Rent"],
		"Expenses Amount": item["Expenses Amount"],
		"Discount Amount": item["Discount Amount"],
		"Final Amount": item["Final Amount"]
	}
}

const TABLE_HEADERS = [
	"#",
	"EJamaat ID",
	"Name",
	"Booking ID",
	"Stay ID",
	"Date",
	"Total Room Rent",
	"Expenses Amount",
	"Discount Amount",
	"Final Amount"
];

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	let startDate = url.searchParams.get('startDate');
	let endDate = url.searchParams.get('endDate');
	const stayRecordReportType = "Short"

	if (!startDate || !endDate) {
		return {
			startDate: strftime('%F'),
			endDate: strftime('%F'),
			shortStayReportData: null,
			tableHeaders: TABLE_HEADERS
		};
	}

	const shortStayReportData = await fetch(`${url.origin}/api/reports/stay-report?${new URLSearchParams({
		startDate,
		endDate,
		stayRecordReportType
	})}`
	).then(res => res.json());

	const records = shortStayReportData.records.map(mapShortStayReportData);

	// Add total amount row so that it can be exported to excel & shown in the table
	if (records.length > 0) {
		records.push({
			"#": "",
			"EJamaat ID": "",
			"Name": "",
			"Booking ID": "",
			"Stay ID": "",
			"Date": "Total",
			"Total Room Rent": shortStayReportData.totals["Total Room Rent"],
			"Expenses Amount": shortStayReportData.totals["Expenses Amount"],
			"Discount Amount": shortStayReportData.totals["Discount Amount"],
			"Final Amount": shortStayReportData.totals["Final Amount"]
		});
	}

	return {
		startDate,
		endDate,
		shortStayReportData: records,
		tableHeaders: TABLE_HEADERS
	};
}
