import { strftime } from '$lib/utils/date-utils';

const mapTaxReportData = (item, index) => {
	const { SubTotal, TaxAmount, Amount } = item;
	const result = {
		"S.No.": index + 1,
		"Date": strftime('%d-%b-%Y', new Date(item.CtimeStamp)),
		"Guest Name": item.BookedName,
		"BookingID": item.BookingID,
		"Rec Type": item.TableType,
		"Pay Type": item.PayType,
		"Rec No.": item.ReceiptID,
		"Amt - In": "",
		"TaxAmt - In": "",
		"Final Amt - In": "",
		"Amt - Out": "",
		"TaxAmt - Out": "",
		"Final Amt - Out": ""
	}
	if (Amount >= 0) {
		result["Amt - In"] = SubTotal;
		result["TaxAmt - In"] = TaxAmount;
		result["Final Amt - In"] = Amount;
	} else {
		result["Amt - Out"] = SubTotal * -1;
		result["TaxAmt - Out"] = TaxAmount * -1;
		result["Final Amt - Out"] = Amount * -1;
	}
	return result;
}

const tableHeaders = [
	"S.No.",
	"Date",
	"Guest Name",
	"BookingID",
	"Rec Type",
	"Pay Type",
	"Rec No.",
	"Amt - In",
	"TaxAmt - In",
	"Final Amt - In",
	"Amt - Out",
	"TaxAmt - Out",
	"Final Amt - Out"
];

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const startDate = url.searchParams.get('startDate');
	const endDate = url.searchParams.get('endDate');
	const reportType = url.searchParams.get('reportType') ?? "All";
	const paymentType = url.searchParams.get('paymentType') ?? "All";

	if (!startDate || !endDate) {
		return {
			startDate: strftime('%F'),
			endDate: strftime('%F'),
			reportType: 'All',
			paymentType: 'All',
		}
	}


	const taxReportData = await fetch(`${url.origin}/api/reports/tax-report?${new URLSearchParams({
		startDate,
		endDate,
		reportType,
		paymentType,
	})}`).then(res => res.json());

	const records = taxReportData.records.map(mapTaxReportData);

	// Add total amount row so that it can be exported to excel & shown in the table
	if (records.length > 0) {
		records.push({
			"S.No.": "",
			"Date": "",
			"Guest Name": "",
			"BookingID": "",
			"Rec Type": "",
			"Pay Type": "",
			"Rec No.": "Total Amount",
			"Amt - In": taxReportData.totals.amountIn,
			"TaxAmt - In": taxReportData.totals.taxAmountIn,
			"Final Amt - In": taxReportData.totals.finalAmountIn,
			"Amt - Out": taxReportData.totals.amountOut,
			"TaxAmt - Out": taxReportData.totals.taxAmountOut,
			"Final Amt - Out": taxReportData.totals.finalAmountOut
		});
	}

	return {
		startDate,
		endDate,
		reportType,
		paymentType,
		taxReportData: records,
		tableHeaders
	};
}
