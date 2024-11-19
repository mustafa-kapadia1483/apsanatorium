import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import sql from 'mssql';

async function getOutstanding(bookingId = '') {
  const baseQuery = `
                SELECT *,
                    (T.[Total Final] - T.[Total Paid Amt] + T.[Debit Credit Amt]) as Balance 
                FROM (
                    SELECT 
                        B.eJamaatID,
                        EM.FullName,
                        StayRecID,
                        StayRecDate,
                        SR.BookingID,
                        TotRoomRentAmt as [Room Rent],
                        TotRoomTax as [Room Tax],
                        (TotRoomRentAmt + TotRoomTax) as [Total Room Rent],
                        DepositConsidered as [Deposit Considered],
                        DepositTax as [Deposit Tax Considered],
                        (DepositConsidered + DepositTax) as [Total Deposit Considered],
                        TotExpenses as [Expenses Amount],
                        ExpTax as [Expenses Tax],
                        (TotExpenses + ExpTax) as [Total Expenses],
                        DiscountAmt as [Discount Amount],
                        DiscountTax as [Discount Tax],
                        (DiscountAmt + DiscountTax) as [Total Discount],
                        GrandTotal as [Final Amount],
                        GrandTotalTax as [Final Tax],
                        (FinalTotal) as [Total Final],
                        ISNULL((SELECT SUM(CalCulatedAmount) FROM dbo.DebitCreditNote DCN WHERE DCN.StayRecID = SR.StayRecID), 0) as [Debit Credit Amt],
                        ISNULL((SELECT SUM(SubTotal) FROM dbo.ReceiptDetails RD WHERE RD.BookingID = SR.BookingID AND RD.StayRecID = SR.StayRecID), 0) as [Paid Amt],
                        ISNULL((SELECT SUM(SubTotalTax) FROM dbo.ReceiptDetails RD WHERE RD.BookingID = SR.BookingID AND RD.StayRecID = SR.StayRecID), 0) as [Paid Tax Amt],
                        ISNULL((SELECT SUM(Amount) FROM dbo.ReceiptDetails RD WHERE RD.BookingID = SR.BookingID AND RD.StayRecID = SR.StayRecID), 0) as [Total Paid Amt],
                        SR.UserID,
                        SR.TimeStamp 
                    FROM StayRecord SR 
                    LEFT OUTER JOIN Booking B ON B.BookingID = SR.BookingID 
                    LEFT OUTER JOIN EJamaatMaster EM ON B.EJamaatID = EM.EJamaatID
                ) T 
                WHERE (T.[Total Final] - T.[Total Paid Amt] + T.[Debit Credit Amt]) > 0
                ${bookingId ? "AND T.BookingID = @bookingId" : ""}`;


  const params = bookingId ? {
    bookingId: { type: sql.VarChar, value: bookingId }
  } : {};

  const data = await executeQuery(baseQuery, params);

  const totals = data.reduce((acc, curr) => ({
    "Final Amount": acc["Final Amount"] + curr['Final Amount'],
    "Final Tax": acc["Final Tax"] + curr['Final Tax'],
    "Paid Amt": acc["Paid Amt"] + curr['Paid Amt'],
    "Paid Tax Amt": acc["Paid Tax Amt"] + curr['Paid Tax Amt'],
    "Balance": acc["Balance"] + curr['Balance']
  }), {
    "Final Amount": 0,
    "Final Tax": 0,
    "Paid Amt": 0,
    "Paid Tax Amt": 0,
    "Balance": 0
  });

  return {
    records: data,
    totals
  };
}

export const GET = async ({ url }) => {
  try {
    const bookingId = url.searchParams.get('bookingId') || "";

    const data = await getOutstanding(bookingId)

    return json(data);
  } catch (err) {
    console.error('Database error:', err);
    return json({ error: 'Internal Server Error' }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
