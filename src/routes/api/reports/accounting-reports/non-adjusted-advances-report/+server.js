import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import sql from 'mssql';


async function getNonAdjustedAdvances(startDate, endDate) {
  try {
    const query = `
            SELECT *,
                (AdvAmt + AdvAmtTax) AS TotAdvance,
                (AdvAmt - AdjAmt) AS UnAdjAmt,
                (AdvAmtTax - AdjAmtTax) AS UnAdjAmtTax,
                (AdvAmt + AdvAmtTax) - (AdjAmt + AdjAmtTax) AS TotUnAdjAmt
            FROM (
                SELECT 
                    em.ejamaatID,
                    em.fullname,
                    oc.OCID,
                    oc.OCDate,
                    oc.BookingID,
                    oc.SubTotal AS AdvAmt,
                    oc.SubTotalTax AS AdvAmtTax,
                    ISNULL((
                        SELECT SUM(AmountAdj) 
                        FROM OtherChargeAdj ocad 
                        WHERE ocad.OCID = oc.OCID
                    ), 0) AS AdjAmt,
                    ISNULL((
                        SELECT SUM(TaxAmount) 
                        FROM OtherChargeAdj ocad 
                        WHERE ocad.OCID = oc.OCID
                    ), 0) AS AdjAmtTax
                FROM OtherCharges oc
                INNER JOIN booking b ON b.BookingID = oc.BookingID
                INNER JOIN EJamaatMaster em ON b.eJamaatID = em.EJamaatID
                WHERE oc.OCDate BETWEEN @startDate AND @endDate
            ) T 
            WHERE ((T.AdvAmt + T.AdvAmtTax) - (T.AdjAmt + T.AdjAmtTax)) != 0 
            ORDER BY T.OCDate`;

    const params = {
      startDate: { type: sql.Date, value: startDate },
      endDate: { type: sql.Date, value: endDate }
    };

    const records = await executeQuery(query, params);
    const totals = records.reduce((acc, curr) => ({
      TotAdvance: acc.TotAdvance + curr.TotAdvance,
      UnAdjAmt: acc.UnAdjAmt + curr.UnAdjAmt,
      UnAdjAmtTax: acc.UnAdjAmtTax + curr.UnAdjAmtTax,
      TotUnAdjAmt: acc.TotUnAdjAmt + curr.TotUnAdjAmt
    }), {
      TotAdvance: 0,
      UnAdjAmt: 0,
      UnAdjAmtTax: 0,
      TotUnAdjAmt: 0
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

    const data = await getNonAdjustedAdvances(startDate, endDate)

    return json(data);
  } catch (err) {
    return json({ error: 'Internal Server Error', message: err.message }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
