import { strftime } from '$lib/utils/date-utils';

const mapStayReportData = (item, index) => {
	return {
		"#": index + 1,
		"EJamaat ID": item.eJamaatID,
		"Name": item.FullName,
		"Booking ID": item.BookingID,
		"Stay Record ID": item.StayRecID,
		"Stay Record Date": strftime('%d-%b-%Y', new Date(item.StayRecDate)),
		"Room Rent (A)": item["Room Rent"],
		"Room Rent Tax (B)": item["Room Tax"],
		"Total Room Rent (C=A+B)": item["Total Room Rent"],
		"Deposit Amount (D)": item["Deposit Considered"],
		"Deposit Tax (E)": item["Deposit Tax Considered"],
		"Total Deposit (F=D+E)": item["Total Deposit Considered"],
		"Expenses Amount (G)": item["Expenses Amount"],
		"Expenses Tax (H)": item["Expenses Tax"],
		"Total Expenses (I=G+H)": item["Total Expenses"],
		"Discount Amount (J)": item["Discount Amount"],
		"Discount Tax (K)": item["Discount Tax"],
		"Total Discount (L=J+K)": item["Total Discount"],
		"Final Amount (M=A-D+G-J)": item["Final Amount"],
		"Final Tax (N=B-E+H-K)": item["Final Tax"],
		"Total Final (O=M+N)": item["Total Final"],
		"Paid Amount (P)": item["Paid Amt"],
		"Paid Tax (Q)": item["Paid Tax Amt"],
		"Total Paid (R=P+Q)": item["Total Paid Amt"],
		"Balance (S=O-R)": item["Balance"],
		"User": item["UserID"]
	}
}

const TABLE_HEADERS = [
	"#",
	"EJamaat ID",
	"Name",
	"Booking ID",
	"Stay Record ID",
	"Stay Record Date",
	"Room Rent (A)",
	"Room Rent Tax (B)",
	"Total Room Rent (C=A+B)",
	"Deposit Amount (D)",
	"Deposit Tax (E)",
	"Total Deposit (F=D+E)",
	"Expenses Amount (G)",
	"Expenses Tax (H)",
	"Total Expenses (I=G+H)",
	"Discount Amount (J)",
	"Discount Tax (K)",
	"Total Discount (L=J+K)",
	"Final Amount (M=A-D+G-J)",
	"Final Tax (N=B-E+H-K)",
	"Total Final (O=M+N)",
	"Paid Amount (P)",
	"Paid Tax (Q)",
	"Total Paid (R=P+Q)",
	"Balance (S=O-R)",
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
			shortStayReportData: null,
			tableHeaders: TABLE_HEADERS
		};
	}

	const stayReportData = await fetch(`${url.origin}/api/reports/accounting-reports/stay-report?${new URLSearchParams({
		startDate,
		endDate
	})}`
	).then(res => res.json());

	const records = stayReportData.records.map(mapStayReportData);

	// Add total amount row so that it can be exported to excel & shown in the table
	if (records.length > 0) {
		records.push({
			"#": "",
			"EJamaat ID": "",
			"Name": "",
			"Booking ID": "",
			"Stay Record ID": "",
			"Stay Record Date": "Total",
			"Room Rent (A)": stayReportData.totals["Room Rent"],
			"Room Rent Tax (B)": stayReportData.totals["Room Tax"],
			"Total Room Rent (C=A+B)": stayReportData.totals["Total Room Rent"],
			"Deposit Amount (D)": stayReportData.totals["Deposit Considered"],
			"Deposit Tax (E)": stayReportData.totals["Deposit Tax Considered"],
			"Total Deposit (F=D+E)": stayReportData.totals["Total Deposit Considered"],
			"Expenses Amount (G)": stayReportData.totals["Expenses Amount"],
			"Expenses Tax (H)": stayReportData.totals["Expenses Tax"],
			"Total Expenses (I=G+H)": stayReportData.totals["Total Expenses"],
			"Discount Amount (J)": stayReportData.totals["Discount Amount"],
			"Discount Tax (K)": stayReportData.totals["Discount Tax"],
			"Total Discount (L=J+K)": stayReportData.totals["Total Discount"],
			"Final Amount (M=A-D+G-J)": stayReportData.totals["Final Amount"],
			"Final Tax (N=B-E+H-K)": stayReportData.totals["Final Tax"],
			"Total Final (O=M+N)": stayReportData.totals["Total Final"],
			"Paid Amount (P)": stayReportData.totals["Paid Amt"],
			"Paid Tax (Q)": stayReportData.totals["Paid Tax Amt"],
			"Total Paid (R=P+Q)": stayReportData.totals["Total Paid Amt"],
			"Balance (S=O-R)": stayReportData.totals["Balance"],
			"User": ""
		});
	}

	return {
		startDate,
		endDate,
		stayReportData: records,
		tableHeaders: TABLE_HEADERS
	};
}
