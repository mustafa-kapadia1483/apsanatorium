import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import { formatDateOrEmpty } from '$lib/server/sql-utls';


async function getDailyGuestCount(params) {
  try {
    // Convert string dates to Date objects
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    // Calculate days between dates (inclusive)
    const noOfDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Calculate days from today until endDate (inclusive)
    const todayDay = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24)) + 1;

    const query = `
      SELECT
        ROW_NUMBER() OVER (ORDER BY BookingDate ASC) AS [#],
        ${formatDateOrEmpty('CAST(BookingDate AS DATE)')} AS [Booking Date],
        ISNULL((
          SELECT SUM(NoOfGuest)  
        FROM (
          SELECT ISNULL(
            (
              SELECT COUNT(BGID) 
              FROM dbo.BookingGuest BG 
              WHERE BG.RBID = RB.RBID
            ), 0
          ) AS NoOfGuest 
          FROM RoomBooking RB 
          WHERE CAST(CONVERT(VARCHAR(10), DATEADD(DAY, 0, BookingDate), 120) AS DATETIME) 
            BETWEEN StartDate AND DATEADD(DAY, 0, EndDate)
            AND Status IN ('CheckedIn', 'CheckedOut', 'Extra')
        ) TT
      ), 0) AS [Guest Count],
      (
        SELECT COUNT(RBID) 
        FROM RoomBooking 
        WHERE StartDate = T.BookingDate 
          AND Status IN ('CheckedIn')
      ) AS [Check In Room Count]
      FROM (
        SELECT * 
        FROM (
          SELECT *, 
            CONVERT(VARCHAR(10), DATEADD(DAY, -n + ${todayDay}, GETDATE()), 120) AS BookingDate
          FROM [TallyTable](${noOfDays})
        ) DateTable 
        WHERE CAST(BookingDate AS DATETIME) 
          BETWEEN CAST(@startDate AS DATETIME) 
          AND CAST(@endDate AS DATETIME)
      ) T 
      ORDER BY BookingDate ASC`;

    const queryParams = {
      startDate: { value: params.startDate, type: "Date" },
      endDate: { value: params.endDate, type: "Date" }
    };

    return await executeQuery(query, queryParams);

  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
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

    const result = await getDailyGuestCount(params);

    return json(result);

  } catch (error) {
    return json({
      error: 'Internal Server Error',
      message: error.message,
    }, { status: 500 });
  }
}