import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import sql from 'mssql';


async function getUnAdjustedAdvances(startDate, endDate) {
  try {
    const query = `
            SELECT DISTINCT *,
                T.Advance - T.AdvanceAdj as Balance 
            FROM (
                SELECT sr.BookingID,
                    ISNULL((
                        SELECT SUM(ioc.Amount) 
                        FROM OtherCharges ioc 
                        WHERE ioc.ChargeType = 'Advance' 
                        AND ioc.BookingID = sr.BookingID 
                        AND ioc.OCDate BETWEEN @startDate AND @endDate
                    ), 0) as Advance,
                    ISNULL((
                        SELECT SUM(ioca.AmountAdj) 
                        FROM OtherChargeAdj ioca
                        INNER JOIN OtherCharges oc ON ioca.OCID = oc.OCID 
                        WHERE oc.ChargeType = 'Advance' 
                        AND ioca.BookingID = sr.BookingID 
                        AND CONVERT(datetime, CONVERT(varchar(10), ioca.OCADate, 112)) BETWEEN @startDate AND @endDate
                    ), 0) as AdvanceAdj
                FROM StayRecord sr
            ) T 
            WHERE T.Advance <> 0 OR T.AdvanceAdj <> 0 
            ORDER BY BookingID DESC`;

    const params = {
      startDate: { type: sql.Date, value: startDate },
      endDate: { type: sql.Date, value: endDate }
    };

    const records = await executeQuery(query, params);
    const totals = records.reduce((acc, curr) => ({
      Advance: acc.Advance + curr.Advance,
      AdvanceAdj: acc.AdvanceAdj + curr.AdvanceAdj,
      Balance: acc.Balance + curr.Balance
    }), {
      Advance: 0,
      AdvanceAdj: 0,
      Balance: 0
    });

    return {
      records,
      totals
    };

  } catch (error) {
    throw new Error(`Error fetching unadjusted advances: ${error.message}`);
  }
}

export const GET = async ({ url }) => {
  try {
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!startDate || !endDate) {
      return json({ error: 'Please select date range' }, { status: 400 })
    }

    const data = await getUnAdjustedAdvances(startDate, endDate)

    return json(data);
  } catch (err) {
    return json({ error: 'Internal Server Error', message: err.message }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
