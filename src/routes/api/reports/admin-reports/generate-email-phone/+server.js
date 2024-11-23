import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';


async function fetchGuests(params) {
  if (!params.guestType) {
    throw new Error('field guestType is required');
  }
  try {
    // Build the condition string
    let conditions = [];
    let baseQuery;
    const queryParams = {};

    if (params.ejaamatId) {
      conditions.push(`em.ejamaatid = @ejaamatId`);
      queryParams.ejaamatId = { type: "VarChar", value: params.ejaamatId };
    }
    if (params.name) {
      conditions.push(`em.Fullname LIKE @name`);
      queryParams.name = { type: "VarChar", value: `%${params.name}%` };
    }
    if (params.email) {
      conditions.push(`em.email LIKE @email`);
      queryParams.email = { type: "VarChar", value: `%${params.email}%` };
    }
    if (params.contact) {
      conditions.push(`(em.ContactNos LIKE @contact OR em.MobileNo LIKE @contact OR em.LocalContactNos LIKE @contact)`);
      queryParams.contact = { type: "VarChar", value: `%${params.contact}%` };
    }

    // Add pagination parameters with defaults
    const page = parseInt(params.page) || 1;
    const pageSize = parseInt(params.pageSize) || 100;
    const offset = (page - 1) * pageSize;

    queryParams.offset = { type: "Int", value: offset };
    queryParams.pageSize = { type: "Int", value: pageSize };

    const additionalConditions = conditions.length > 0
      ? 'AND ' + conditions.join(' AND ')
      : '';

    // Build the final query based on guest type
    if (params.guestType.includes('current')) {
      baseQuery = `
                WITH PaginatedResults AS (
                  SELECT
                    ROW_NUMBER() OVER (ORDER BY em.ejamaatid) AS #,
                    COUNT(*) OVER () as TotalCount,
                    em.ejamaatid as [EjamaatID],
                    em.Fullname as [Name],
                    em.email as [Email],
                    em.ContactNos as [Contact No.],
                    em.MobileNo as [Mobile No.],
                    em.LocalContactNos as [Local Contact No.]
                  FROM vwBookingGuest vbg
                  JOIN Roombooking rb ON vbg.rbID = rb.RBID
                  JOIN EJamaatMaster em ON vbg.ejamaatID = em.ejamaatID
                  WHERE vbg.rbID = rb.RBID
                  AND vbg.ejamaatID = em.ejamaatID
                  AND @currentDate BETWEEN rb.startdate AND DATEADD(day, 0, rb.EndDate)
                  AND rb.Status IN ('CheckedIn', 'CheckedOut', 'Extra')
                  AND rb.RoomIsFree = 'N'
                  ${additionalConditions}
                )
                SELECT * FROM PaginatedResults
                WHERE # BETWEEN @offset + 1 AND @offset + @pageSize`;
      queryParams.currentDate = { type: "Date", value: new Date() };
    } else {
      baseQuery = `
                WITH PaginatedResults AS (
                  SELECT 
                    ROW_NUMBER() OVER (ORDER BY em.ejamaatid) AS #,
                    COUNT(*) OVER () as TotalCount,
                    em.ejamaatid as EjamaatID,
                    em.Fullname as Name,
                    em.email as Email,
                    em.ContactNos as [Contact No.],
                    em.MobileNo as [Mobile No.],
                    em.LocalContactNos as [Local Contact No.]
                  FROM EJamaatMaster em
                  WHERE 1=1 ${additionalConditions}
                )
                SELECT * FROM PaginatedResults
                WHERE # BETWEEN @offset + 1 AND @offset + @pageSize`;
    }

    const result = await executeQuery(baseQuery, queryParams);

    // Extract total count from first row (if results exist)
    const totalCount = result.length > 0 ? result[0].TotalCount : 0;

    return {
      data: result,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    };

  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export const GET = async ({ url }) => {
  try {
    // Get parameters from URL
    const params = {
      ejaamatId: url.searchParams.get('ejaamatId'),
      name: url.searchParams.get('name'),
      email: url.searchParams.get('email'),
      contact: url.searchParams.get('contact'),
      guestType: url.searchParams.get('guestType'),
      page: url.searchParams.get('page'),
      pageSize: url.searchParams.get('pageSize')
    };

    const result = await fetchGuests(params);

    return json(result);

  } catch (error) {
    return json({
      error: 'Internal Server Error',
      message: error.message,
    }, { status: 500 });
  }
}