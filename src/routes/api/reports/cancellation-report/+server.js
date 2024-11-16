import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import sql from 'mssql';

export const GET = async ({ url }) => {
  try {
    // Get parameters from URL
    const bookingId = url.searchParams.get('bookingId') || '';
    const ejamaatId = url.searchParams.get('ejamaatId') || '';
    const selectedTypes = url.searchParams.get('selectedTypes')?.split(',') || [];
    const startDate = url.searchParams.get('startDate') || '';
    const endDate = url.searchParams.get('endDate') || '';

    const params = { startDate: { type: sql.Date, value: startDate }, endDate: { type: sql.Date, value: endDate } }

    // Build conditions similar to original
    let cond = '';

    // Add booking ID condition
    if (bookingId.trim()) {
      cond += `AND dl.BookingID=@bookingId `;
      params.bookingId = { type: sql.VarChar, value: bookingId.trim() };
    }

    // Add ejamaat ID condition
    if (ejamaatId.trim()) {
      cond += `AND dl.EjamaatID=@ejamaatId `;
      params.ejamaatId = { type: sql.VarChar, value: ejamaatId.trim() };
    }

    // Add types condition
    if (!selectedTypes.includes('All')) {
      cond += `AND dl.Types in (${selectedTypes.map(type => `'${type}'`).join(',')})`;
    } else {
      cond += `AND dl.Types in ('Receipt','Advance','Stay Record')`;
    }

    const query = `
            SELECT 
                dl.typesDate as [Receipt Date],
                CASE 
                    when dl.Types='Receipt' THEN  
                        CASE WHEN dl.FinalAmount < 0 then 'Refund Receipt' 
                        ELSE 'Rent Receipt' 
                        END 
                    else dl.Types 
                end as [Receipt Type],
                dl.TypesID as [Receipt ID], 
                dl.BookingID,
                em.FullName,
                dl.EjamaatID,
                GrandTotal as SubTotal,
                GrandTotalTax as [SubTotal Tax],
                FinalAmount as [Final Amount]
            FROM DeleteLog dl, EJamaatMaster em 
            WHERE dl.EjamaatID = em.EJamaatID 
                AND dl.TypesDate between @startDate AND @endDate
                ${cond}
            order by dl.TypesDate asc`;

    const result = await executeQuery(query, params);

    return json(result);

  } catch (error) {
    return json({
      error: 'Internal Server Error',
      message: error.message,
    }, { status: 500 });
  }
}