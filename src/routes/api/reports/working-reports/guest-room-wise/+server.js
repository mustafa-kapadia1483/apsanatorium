import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import { formatDateOrEmpty } from '$lib/server/sql-utls.js';

async function getGuestRoomWise(params) {
  async function getGuestNames(bookingId, rbId) {
    const query = `
          select 
            em.FullName 
          from 
            BookingGuest bg,
            EJamaatMaster em 
          where bg.BookingID=@bookingId and bg.RBID=@rbId and bg.eJamaatID=em.EJamaatID`;

    const queryParams = {
      bookingId: { type: 'VarChar', value: bookingId },
      rbId: { type: 'VarChar', value: rbId }
    };

    const result = await executeQuery(query, queryParams);
    return result.map(guest => guest.FullName);
  }

  function calculateRoomCharges(booking) {
    let amount = 0;
    let status = booking.Status;
    const numDays = booking.TotDays;
    const numGuests = booking.NumGuests;

    switch (booking.Status) {
      case 'Cancelled':
        amount = booking.ForfeitedAmount;
        status = amount > 0 ? 'Room Cancelation Charges' : 'Cancelled';
        break;

      case 'CheckedOut':
        status = 'Checked Out';
      // fall through to calculation
      case 'CheckedIn':
        status = status === 'CheckedIn' ? 'Checked In' : status;
      // fall through to calculation
      case 'Extra':
        if (booking.Status === 'Extra') {
          status = 'Stay Extension';
        }

        // Base room rent calculation
        const isHalfCharge = booking.RoomCharge === 'Half';
        const baseMultiplier = isHalfCharge ? 0.5 : 1;

        // Base amount for up to 2 guests
        const baseOccupancy = numGuests >= 2 ? 1 : (numGuests <= 0 ? 0 : 1);
        amount += baseOccupancy * booking.RoomRent * numDays * baseMultiplier;

        // Additional guests calculations (3-8)
        const tiers = [
          { baseGuests: 2, rate: booking.Extra2Guest },
          { baseGuests: 4, rate: booking.Extra4Guest },
          { baseGuests: 6, rate: booking.Extra6Guest }
        ];

        tiers.forEach(({ baseGuests, rate }) => {
          const extraGuests = Math.max(0, numGuests - baseGuests);
          const applicableGuests = Math.min(2, extraGuests);
          const adjustedRate = isHalfCharge ? rate / 2 : rate;
          amount += applicableGuests * adjustedRate * numDays;
        });
        break;
    }

    // Expense also gets added to roomRent
    amount += booking.Expense

    return { amount, status };
  }

  try {
    const { startDate, endDate, guestName, ejammatId, roomId } = params;

    // Validate dates
    if (!startDate || !endDate) {
      throw new Error('Please select Date.');
    }

    // Build conditions
    let conditions = [];
    let queryParams = {
      startDate: { type: "Date", value: startDate },
      endDate: { type: "Date", value: endDate },
    };

    if (guestName?.trim()) {
      const words = guestName.trim().split(' ');
      const nameConditions = words
        .map((word, i) => {
          const paramName = `guestName${i}`;
          queryParams[paramName] = { type: "VarChar", value: `%${word}%` };
          return `em.FullName LIKE @${paramName}`;
        })
        .join(' AND ');

      conditions.push(`rb.RBID IN (
                SELECT RBID 
                FROM BookingGuest bg
                JOIN EJamaatMaster em ON bg.eJamaatID = em.EJamaatID 
                WHERE ${nameConditions}
            )`);
    }

    if (ejammatId?.trim()) {
      queryParams.ejammatId = { type: "VarChar", value: ejammatId.trim() };
      conditions.push(`rb.RBID IN (
                SELECT RBID 
                FROM BookingGuest 
                WHERE EJamaatID = @ejammatId
            )`);
    }

    if (roomId?.trim()) {
      queryParams.roomId = { type: "VarChar", value: roomId.trim() };
      conditions.push(`rb.RoomID = @roomId`);
    }

    // Build WHERE clause
    const whereClause = conditions.length
      ? 'AND ' + conditions.join(' AND ')
      : '';

    // Main query
    const sql = `
            SELECT
                rb.rbid, 
                ${formatDateOrEmpty('rb.StartDate')} AS [Check In],
                ${formatDateOrEmpty('DATEADD(day, 1, rb.EndDate)')} AS [Check Out],
                rb.Status, rb.RoomID, rb.RoomType,
                rb.BookingID, rb.RoomCharge, rb.RoomRent,
                ISNULL((
                    SELECT e.FullName 
                    FROM Booking b
                    JOIN EJamaatMaster e ON b.eJamaatID = e.EJamaatID 
                    WHERE b.BookingID = rb.BookingID
                ), '') as BookedPerson,
                rb.Extra2Guest, rb.Extra4Guest, rb.Extra6Guest,
                DATEDIFF(DAY, rb.StartDate, DATEADD(day, 1, rb.EndDate)) as TotDays,
                ISNULL((
                    SELECT COUNT(bg.BGID) 
                    FROM BookingGuest bg 
                    WHERE bg.RBID = rb.RBID AND bg.BookingID = rb.BookingID
                ), 0) as NumGuests,
                ISNULL((
                    SELECT SUM(ge.Amount + ge.TaxAmount) 
                    FROM dbo.GuestExpenses ge 
                    WHERE ge.RBID = rb.RBID AND ge.BookingID = rb.BookingID
                ), 0) as Expense
            FROM RoomBooking rb
            WHERE rb.Status IN ('Booked', 'CheckedIn', 'CheckedOut', 'Extra')
            ${whereClause}
            AND (
                (rb.StartDate <= @startDate AND rb.EndDate >= @startDate)
                OR (rb.StartDate <= @endDate AND rb.EndDate >= @endDate)
                OR (rb.StartDate >= @startDate AND rb.EndDate <= @endDate)
                OR (rb.StartDate <= @startDate AND rb.EndDate >= @endDate)
            )
            ORDER BY rb.BookingID DESC, rb.StartDate, rb.EndDate`;

    // Execute query using executeQuery helper
    const result = await executeQuery(sql, queryParams);

    const transformResult = []

    for (let i = 0; i < result.length; i++) {
      const record = result[i];

      const { amount: roomRent, status: displayStatus } = calculateRoomCharges(record)

      // Get the list of guest names associated with this booking and room
      // by querying BookingGuest and EJamaatMaster tables using the booking ID and room booking ID
      const guestNames = await getGuestNames(record.BookingID, record.rbid)


      transformResult.push({
        "#": i + 1,
        "Check In": record["Check In"],
        "Check Out": record["Check Out"],
        "Status": displayStatus,
        "Room No.": `${record.RoomID} ${record.RoomType}`,
        "Booking ID": record.BookingID,
        "Booking Person Name": record.BookedPerson,
        "No. of Days": record.TotDays,
        "Guest Name": guestNames,
        "Total Guest": record.NumGuests,
        "Room Rate": record.RoomRent,
        "Expense": record.Expense,
        "Room Rent": roomRent

      })
    }

    return transformResult

  } catch (error) {
    throw error;
  }
}

export const GET = async ({ url }) => {
  const requiredParams = ['startDate', 'endDate'];
  const missingParams = requiredParams.filter(param => !url.searchParams.has(param));

  if (missingParams.length > 0) {
    return json({
      error: 'Bad Request',
      message: `Missing search parameters: ${missingParams.join(', ')}`
    }, { status: 400 });
  }

  const params = {
    startDate: url.searchParams.get('startDate'),
    endDate: url.searchParams.get('endDate'),
    guestName: url.searchParams.get('guestName'),
    ejammatId: url.searchParams.get('ejammatId'),
    roomId: url.searchParams.get('roomId'),
  };


  try {
    const result = await getGuestRoomWise(params);
    return json(result);

  } catch (error) {
    return json({
      error: 'Internal Server Error',
      message: error.message,
    }, { status: 500 });
  }
}