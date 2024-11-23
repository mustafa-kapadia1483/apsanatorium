import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';

export const GET = async ({ url }) => {
  try {
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')
    const stayRecordReportType = url.searchParams.get('stayRecordReportType') || "Full"

    if (!startDate || !endDate) {
      return json({ error: 'Please select date range' }, { status: 400 })
    }

    const query = stayRecordReportType === "Short" ? `
      SELECT 
        B.eJamaatID,
        EM.FullName,
        StayRecID,
        StayRecDate,
        SR.BookingID,
        (TotRoomRentAmt + TotRoomTax) as [Total Room Rent],
        TotExpenses as [Expenses Amount],
        DiscountAmt as [Discount Amount],
        GrandTotal as [Final Amount],
        SR.UserID,
        SR.TimeStamp
      FROM StayRecord SR
      LEFT OUTER JOIN Booking B 
        ON B.BookingID = SR.BookingID
      LEFT OUTER JOIN EJamaatMaster EM 
        ON B.EJamaatID = EM.EJamaatID
      WHERE CAST(CONVERT(varchar(8), StayRecDate, 112) as datetime) 
        BETWEEN @startDate AND @endDate 
      ORDER BY StayRecDate DESC` : `
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
          ISNULL((
            SELECT SUM(CalCulatedAmount) 
            FROM dbo.DebitCreditNote DCN 
            WHERE DCN.StayRecID = SR.StayRecID
          ), 0) as [Debit Credit Amt],
          ISNULL((
            SELECT SUM(SubTotal) 
            FROM dbo.ReceiptDetails RD 
            WHERE RD.BookingID = SR.BookingID 
              AND RD.StayRecID = SR.StayRecID
          ), 0) as [Paid Amt],
          ISNULL((
            SELECT SUM(SubTotalTax) 
            FROM dbo.ReceiptDetails RD 
            WHERE RD.BookingID = SR.BookingID 
              AND RD.StayRecID = SR.StayRecID
          ), 0) as [Paid Tax Amt],
          ISNULL((
            SELECT SUM(Amount) 
            FROM dbo.ReceiptDetails RD 
            WHERE RD.BookingID = SR.BookingID 
              AND RD.StayRecID = SR.StayRecID
          ), 0) as [Total Paid Amt],
          SR.UserID,
          SR.TimeStamp
        FROM StayRecord SR
        LEFT OUTER JOIN Booking B 
          ON B.BookingID = SR.BookingID
        LEFT OUTER JOIN EJamaatMaster EM 
          ON B.EJamaatID = EM.EJamaatID
      ) T 
      WHERE CAST(CONVERT(varchar(8), StayRecDate, 112) as datetime) 
        BETWEEN @startDate AND @endDate 
      ORDER BY StayRecDate DESC`

    const params = {
      startDate: { type: "Date", value: startDate },
      endDate: { type: "Date", value: endDate }
    }

    const result = await executeQuery(query, params)

    // Calculate totals
    const initialTotals = stayRecordReportType === "Short" ? {
      "Total Room Rent": 0,
      "Expenses Amount": 0,
      "Discount Amount": 0,
      "Final Amount": 0
    } : {
      "Room Rent": 0,
      "Room Tax": 0,
      "Total Room Rent": 0,
      "Deposit Considered": 0,
      "Deposit Tax Considered": 0,
      "Total Deposit Considered": 0,
      "Expenses Amount": 0,
      "Expenses Tax": 0,
      "Total Expenses": 0,
      "Discount Amount": 0,
      "Discount Tax": 0,
      "Total Discount": 0,
      "Final Amount": 0,
      "Final Tax": 0,
      "Total Final": 0,
      "Debit Credit Amt": 0,
      "Paid Amt": 0,
      "Paid Tax Amt": 0,
      "Total Paid Amt": 0,
      "Balance": 0
    };

    const totals = result.reduce((acc, curr) => {
      // Calculate running totals for each field
      const fields = Object.keys(initialTotals);
      const updatedTotals = {};

      fields.forEach(field => {
        updatedTotals[field] = acc[field] + curr[field];
      });

      return updatedTotals;
    }, initialTotals);

    return json({
      records: result,
      totals,
      recordCount: result.length
    })

  } catch (error) {
    return json({ error: 'Internal server error', message: error.message }, { status: 500 })
  }
}