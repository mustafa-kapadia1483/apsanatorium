import { strftime } from '$lib/utils/date-utils';

const mapGstReportData = (item, index) => {
	return {
		"#": index + 1,
		"EJamaat ID": item.eJamaatID,
		"Name": item.FullName,
		"Booking ID": item.BookingID,
		"Invoice ID": item.InvoiceID,
		"Invoice Date": strftime('%d-%b-%Y', new Date(item.InvoiceDate)),
		"Total Room Rent (A)": item["Total Room Rent"],
		"Discount (B)": item.Discount,
		"Taxable Room Rent (C=A-B)": item["Taxable Room Rent"],
		"CGST (D)": item.CGST,
		"SGST (E)": item.SGST,
		"Net Room Rent (F=C+D+E)": item["Net Room Rent"],
		"Additional Charge (G)": item["Additional Charge"],
		"User": item.UserID
	}
}

const TABLE_HEADERS = [
	"#",
	"EJamaat ID",
	"Name",
	"Booking ID",
	"Invoice ID",
	"Invoice Date",
	"Total Room Rent (A)",
	"Discount (B)",
	"Taxable Room Rent (C=A-B)",
	"CGST (D)",
	"SGST (E)",
	"Net Room Rent (F=C+D+E)",
	"Additional Charge (G)",
	"User"
];

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	let startDate = url.searchParams.get('startDate');
	let endDate = url.searchParams.get('endDate');

	if (!startDate || !endDate) {
		return {
			startDate: strftime('%F'),
			endDate: strftime('%F'),
			roomGstReportData: [],
			tableHeaders: TABLE_HEADERS
		};
	}

	const roomGstReportData = await fetch(`${url.origin}/api/reports/room-gst-report?${new URLSearchParams({
		startDate,
		endDate,
	})}`
	).then(res => res.json());

	const records = roomGstReportData.records.map(mapGstReportData);

	// Add total amount row so that it can be exported to excel & shown in the table
	if (records.length > 0) {
		records.push({
			"#": "",
			"EJamaat ID": "",
			"Name": "",
			"Booking ID": "",
			"Invoice ID": "",
			"Invoice Date": "Total",
			"Total Room Rent (A)": roomGstReportData.totals.totalRoomRent,
			"Discount (B)": roomGstReportData.totals.discount,
			"Taxable Room Rent (C=A-B)": roomGstReportData.totals.taxableRoomRent,
			"CGST (D)": roomGstReportData.totals.cgst,
			"SGST (E)": roomGstReportData.totals.sgst,
			"Net Room Rent (F=C+D+E)": roomGstReportData.totals.netRoomRent,
			"Additional Charge (G)": roomGstReportData.totals.additionalCharge,
			"User": ""
		});
	}

	return {
		startDate,
		endDate,
		roomGstReportData: records,
		tableHeaders: TABLE_HEADERS
	};
}
