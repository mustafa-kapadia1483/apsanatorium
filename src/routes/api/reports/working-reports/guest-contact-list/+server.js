import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import { formatDateOrEmpty } from '$lib/server/sql-utls';

async function getGuestContactList(params) {
  const query = `
    SELECT
        ROW_NUMBER() OVER (ORDER BY StartDate, EndDate, RoomID) AS #,
        T.BookingID, 
        RoomID as [Room No.], 
        ${formatDateOrEmpty('StartDate')} + ' (' + ETA + ')' as [Start Date], 
        ${formatDateOrEmpty('DATEADD(day, 1, EndDate)')} + ' (' + ExpectedCheckOut + ')' as [End Date], 
        Status, 
        e.FullName + ' (EID:' + CAST(e.EJamaatID AS VARCHAR) + ')' as [Name],
        ContactNos AS [Contact No.], 
        MobileNo AS [Mobile No.], 
        eMail AS Email
            FROM (
                SELECT * FROM roombooking 
                WHERE (
                    (StartDate BETWEEN @startDate AND @endDate) OR
                    (EndDate BETWEEN @startDate AND @endDate) OR
                    (StartDate <= @startDate AND EndDate >= @endDate)
                )
                AND status <> 'Cancelled'
            ) T, Booking B, eJamaatMaster E
            WHERE T.BookingID = B.BookingID AND B.eJamaatID = E.eJamaatID
            ORDER BY StartDate, EndDate, RoomID DESC`;
  const queryParams = {
    startDate: { value: params.startDate, type: "Date" },
    endDate: { value: params.endDate, type: "Date" }
  };

  return await executeQuery(query, queryParams);
}

export const GET = async ({ url }) => {
  // Get parameters from URL
  const params = {
    startDate: url.searchParams.get('startDate'),
    endDate: url.searchParams.get('endDate')
  };

  const missingParams = Object.entries(params).filter(([key, value]) => !value).map(([key]) => key);

  if (missingParams.length > 0) {
    return json({
      error: 'Bad Request',
      message: `Missing search parameters: ${missingParams.join(', ')}`
    }, { status: 400 });
  }

  try {

    const result = await getGuestContactList(params);

    return json(result);

  } catch (error) {
    return json({
      error: 'Internal Server Error',
      message: error.message,
    }, { status: 500 });
  }
}