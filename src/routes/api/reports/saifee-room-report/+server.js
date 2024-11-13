import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import { strftime, formatTimeWithAMPM } from '$lib/utils/date-utils';
import sql from 'mssql';

async function getWeddingPackageReport(startDate, endDate) {
  const condition = "and vwcal.package in('Saifee')"

  const query = `
    SELECT 
      vwcal.package,
      vwcal.BookingID,
      vwcal.RoomID,
      em.FullName,
      vwcal.eJamaatID,
      vwcal.StartDate,
      DATEADD(day, 1, vwcal.EndDate) as EndDate,
      vwcal.ExpectedCheckOut,
      vwcal.ETA,
      vwcal.RoomRentTotal,
      ISNULL((ge.Amount), 0) as WeddExp,
      ISNULL((ROUND((FLOOR(vwcal.RoomRentTax) + ge.TaxAmount), 0)), 0) as TotTax,
      ISNULL((ROUND((vwcal.RoomRentTotal + ge.Amount + FLOOR(vwcal.RoomRentTax) + ge.TaxAmount), 0)), 0) as GrandTotal
    FROM VWRoomCalculation vwcal 
    LEFT OUTER JOIN GuestExpenses ge 
      ON ge.RBID = vwcal.RBID 
      AND ge.BookingID = vwcal.BookingID 
      AND ge.ExpenseID = 'Wedding Package'
    LEFT OUTER JOIN EJamaatMaster em 
      ON em.EJamaatID = vwcal.ejamaatID
    WHERE vwcal.Status not in ('Cancelled')
      ${condition}
      AND (vwcal.StartDate BETWEEN @startDate AND @endDate 
      OR vwcal.EndDate BETWEEN @startDate AND @endDate)
    ORDER BY StartDate`

  const params = {
    startDate: { type: sql.Date, value: startDate },
    endDate: { type: sql.Date, value: endDate }
  }

  return await executeQuery(query, params)
}

export const GET = async ({ url }) => {
  try {
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!startDate || !endDate) {
      return json({ error: 'Please select date range' }, { status: 400 });
    }

    const data = await getWeddingPackageReport(startDate, endDate)

    // Format the dates and numbers as needed
    const formattedData = data.map(row => ({
      ...row,
      StartDate: `${strftime('%d-%b-%Y', row.StartDate)} (${formatTimeWithAMPM(row.ETA)})`,
      EndDate: `${strftime('%d-%b-%Y', row.EndDate)} (${formatTimeWithAMPM(row.ExpectedCheckOut)})`,
      RoomRentTotal: row.RoomRentTotal,
      WeddExp: row.WeddExp === 0 ? '' : row.WeddExp,
      TotTax: row.TotTax === 0 ? '' : row.TotTax,
      GrandTotal: row.GrandTotal === 0 ? '' : row.GrandTotal
    }))

    return json(formattedData);
  } catch (err) {
    console.error('Database error:', err);
    return json({ error: 'Internal Server Error' }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
