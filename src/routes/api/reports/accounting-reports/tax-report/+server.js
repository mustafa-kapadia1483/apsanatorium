
import { json } from '@sveltejs/kit';
import { strftime } from '$lib/utils/date-utils';
import { executeQuery } from '$lib/server/database';

async function getTaxReport(startDate, endDate, reportType, paymentType) {

  const params = {
    startDate: { type: "Date", value: startDate },
    endDate: { type: "Date", value: endDate }
  };

  if (reportType !== 'All') {
    params.reportType = { type: "VarChar", value: reportType };
  }
  if (paymentType !== 'All') {
    params.paymentType = { type: "VarChar", value: paymentType };
  }

  let query = `
      SELECT DISTINCT 
        T.BookingID, T.TableType, T.Remarks, T.ReceiptID, 
        T.Amount, SubTotal, T.TaxAmount, T.UserID, 
        T.CtimeStamp, VD.BookedName, T.PayType 
      FROM (
        SELECT 
          'Advance' as TableType,
          CONVERT(VARCHAR, OCID) as ReceiptID,
          BookingID, Amount, SubTotal,
          SubTotalTax as TaxAmount,
          Remarks, PaymentType AS PayType,
          UserID, OCDate as CtimeStamp
        FROM dbo.OtherCharges
        UNION
        SELECT 
          CASE WHEN Amount > 0 THEN 'Rent' ELSE 'Refund' END as TableType,
          ReceiptID, BookingID, Amount, SubTotal,
          SubTotalTax as TaxAmount,
          '' As Remarks, ReceiptType As PayType,
          UserID, RctDate as CtimeStamp
        FROM dbo.Receipt
      ) T 
      LEFT OUTER JOIN vwRoomDetails VD ON T.BookingID = VD.BookingID 
      WHERE 
        ${reportType === 'All' ? '1=1' : "TableType = @reportType"} 
        AND ${paymentType === 'All' ? '1=1' : "T.PayType = @paymentType"}
        AND CONVERT(DATETIME, CONVERT(VARCHAR(10), T.CtimeStamp, 112)) 
          BETWEEN @startDate AND @endDate
      ORDER BY T.CtimeStamp ASC`;

  const result = await executeQuery(query, params);

  // Calculate totals
  const totals = result.reduce((acc, row) => {
    if (row.Amount >= 0) {
      acc.amountIn += row.SubTotal;
      acc.finalAmountIn += row.Amount;
      acc.taxAmountIn += row.TaxAmount;
    } else {
      acc.amountOut += (-1 * row.SubTotal);
      acc.finalAmountOut += (-1 * row.Amount);
      acc.taxAmountOut += (-1 * row.TaxAmount);
    }
    return acc;
  }, {
    amountIn: 0,
    finalAmountIn: 0,
    taxAmountIn: 0,
    amountOut: 0,
    finalAmountOut: 0,
    taxAmountOut: 0
  });

  return {
    records: result,
    totals: totals
  };
}

export async function GET({ url }) {
  const startDate = url.searchParams.get('startDate') ?? strftime('%F');
  const endDate = url.searchParams.get('endDate') ?? strftime('%F');
  const reportType = url.searchParams.get('reportType') ?? "All";
  const paymentType = url.searchParams.get('paymentType') ?? "All";

  try {
    return json(await getTaxReport(startDate, endDate, reportType, paymentType));
  } catch (error) {
    return json({ error: 'Internal server error', message: error.message }, { status: 500 })
  }
}
