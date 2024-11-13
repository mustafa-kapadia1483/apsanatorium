import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import sql from 'mssql';
export const GET = async ({ url }) => {
  try {
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    if (!startDate || !endDate) {
      return json({ error: 'Please select date range' }, { status: 400 })
    }

    const query = `select *,(T.[Total Final] -T.[Total Paid Amt]+T.[Debit Credit Amt]) as Balance from (select B.eJamaatID,EM.FullName,StayRecID, StayRecDate, SR.BookingID, TotRoomRentAmt as [Room Rent],TotRoomTax as [Room Tax],(TotRoomRentAmt + TotRoomTax) as [Total Room Rent] ,DepositConsidered as [Deposit Considered],DepositTax as [Deposit Tax Considered],(DepositConsidered+DepositTax) as [Total Deposit Considered] ,TotExpenses as [Expenses Amount],ExpTax as [Expenses Tax],(TotExpenses + ExpTax) as [Total Expenses] ,DiscountAmt as [Discount Amount],DiscountTax as [Discount Tax],(DiscountAmt+DiscountTax) as [Total Discount] ,GrandTotal as [Final Amount],GrandTotalTax as [Final Tax],(FinalTotal) as [Total Final] ,isnull((select sum(CalCulatedAmount) from dbo.DebitCreditNote DCN where DCN.StayRecID=SR.StayRecID),0) as [Debit Credit Amt] ,isnull((select sum(SubTotal) from dbo.ReceiptDetails RD where RD.BookingID=SR.BookingID and RD.StayRecID=SR.StayRecID),0) as [Paid Amt] ,isnull((select sum(SubTotalTax) from dbo.ReceiptDetails RD where RD.BookingID=SR.BookingID and RD.StayRecID=SR.StayRecID),0) as [Paid Tax Amt] ,isnull((select sum(Amount) from dbo.ReceiptDetails RD where RD.BookingID=SR.BookingID and RD.StayRecID=SR.StayRecID),0) as [Total Paid Amt] ,SR.UserID, SR.TimeStamp from StayRecord SR Left Outer Join Booking B on B.BookingID=SR.BookingID Left Outer Join EJamaatMaster EM on B.EJamaatID=EM.EJamaatID) T where Cast(CONVERT(varchar(8), StayRecDate, 112) as datetime) between @startDate and @endDate order by StayRecDate desc`

    const params = {
      startDate: { type: sql.Date, value: startDate },
      endDate: { type: sql.Date, value: endDate }
    }

    const result = await executeQuery(query, params)

    // Calculate totals
    const totals = result.reduce((acc, curr) => ({
      "Total Room Rent": acc["Total Room Rent"] + curr["Total Room Rent"],
      "Expenses Amount": acc["Expenses Amount"] + curr["Expenses Amount"],
      "Discount Amount": acc["Discount Amount"] + curr["Discount Amount"],
      "Final Amount": acc["Final Amount"] + curr["Final Amount"]
    }), {
      "Total Room Rent": 0,
      "Expenses Amount": 0,
      "Discount Amount": 0,
      "Final Amount": 0
    })

    return json({
      records: result,
      totals,
      recordCount: result.length
    })

  } catch (error) {
    return json({ error: 'Internal server error', message: error.message }, { status: 500 })
  }
}