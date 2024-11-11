import { json } from '@sveltejs/kit';
import sql from 'mssql';
import { executeQuery } from '$lib/server/database';
import { strftime } from '$lib/utils/date-utils';
import { roomViewIcons } from '$lib/utils/room-view-icons';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const date = url.searchParams.get('date');

  if (!date) {
    return json({
      error: 'Date is required'
    });
  }

  try {
    // Get floor data
    const floorQuery = `SELECT * FROM floorMaster ORDER BY FloorID DESC`;
    const floors = await executeQuery(floorQuery);

    const floorsWithRooms = await Promise.all(floors.map(async floor => {
      const roomQuery = `
        SELECT 
          R.*,
          ISNULL(T.RBID, 0) as RBID,
          ISNULL(T.RoomID, 0) as BookedRoomID,
          ISNULL(T.StartDate, '') as StartDate,
          ISNULL(T.EndDate, '') as EndDate,
          ISNULL(T.Status, '') as Status,
          ISNULL(T.BookingID, '') as BookingID,
          ISNULL(T.RoomIsFree, 'Y') as RoomIsFree,
          T.Package
        FROM dbo.Rooms R
        LEFT OUTER JOIN (
          SELECT *
          FROM RoomBooking
          WHERE @date BETWEEN StartDate AND EndDate
          AND status NOT IN ('Cancelled')
        ) T ON R.RoomID = T.RoomID
        WHERE R.IsActive = 'Y'
        AND R.FloorID = ${floor.FloorID}`;

      const dateParam = { date: { type: sql.Date, value: date } };
      const rooms = await executeQuery(roomQuery, dateParam);

      // Get additional details for each room
      const roomsWithDetails = await Promise.all(rooms.map(async room => {
        const details = await getRoomDetails(room.RBID, room.Status);
        return {
          ...room,
          details,
          cssClass: getRoomCssClass(room.Status),
        };
      }));

      return {
        ...floor,
        rooms: roomsWithDetails,
      };
    }));

    return json({
      floors: floorsWithRooms
    });
  } catch (err) {
    console.log(err);
    return json({
      error: err
    });
  }
}

async function getRoomDetails(RBID, status) {
  if (RBID === 0 && !status) {
    return {
      message: 'Free Room'
    };
  }

  const query = `
    SELECT 
      RB.*,
      ISNULL(B.eJamaatID, 0) as eJamaatID,
      (EM.FullName) as Name,
      BookedBy,
      ISNULL((
        SELECT Count(BGID) 
        FROM dbo.BookingGuest BG  
        WHERE BG.RBID = RB.RBID 
        AND BG.BookingID = RB.BookingID
      ), 0) as CntPerson,
      ISNULL((
        SELECT Remark 
        FROM dbo.RoomBlock M  
        WHERE M.BlockID = RB.BookingID
      ), '') as Remark
    FROM dbo.RoomBooking RB
    LEFT OUTER JOIN dbo.Booking B ON B.BookingID = RB.BookingID
    LEFT OUTER JOIN dbo.EJamaatMaster EM ON B.ejamaatID = EM.ejamaatID
    WHERE RB.RBID = ${RBID}`;

  const result = await executeQuery(query);
  if (result.length === 0) return null;

  const room = result[0];
  return {
    roomId: room.RoomID,
    bookingId: room.BookingID,
    bookedBy: room.BookedBy,
    roomType: room.RoomType,
    package: room.Package ? {
      name: room.Package,
      comment: room.PackageComment
    } : null,
    status: room.Status,
    dates: {
      start: strftime('%d-%b-%Y', new Date(room.StartDate)),
      end: strftime('%d-%b-%Y', new Date(room.EndDate)),
      startDay: strftime('%A', new Date(room.StartDate)),
      endDay: strftime('%A', new Date(room.EndDate))
    },
    guest: {
      eJamaatID: room.eJamaatID,
      name: room.Name,
      count: room.CntPerson
    },
    eta: formatTimeWithAMPM(room.ETA),
    etd: formatTimeWithAMPM(room.ExpectedCheckOut),
    amenities: {
      toiletSeat: room.ToiletSeat === 'Y',
      wheelChair: room.WheelChair === 'Y',
      otherRequests: room.OtherRequest
    },
    remark: room.Remark
  };
}

function getRoomCssClass(status) {
  switch (status) {
    case 'Booked': return 'Booked';
    case 'CheckedIn':
    case 'CheckedOut': return 'Occupied';
    case 'Extra': return 'Extra';
    case 'Blocked': return 'Blocked';
    default: return 'Empty';
  }
}

/**
 * Converts a 24-hour time string to 12-hour format with AM/PM
 * @param {string} time - Time string in 24-hour format (HH:mm)
 * @returns {string} Time string in 12-hour format with AM/PM, or empty string if input is invalid
 * @example
 * formatTimeWithAMPM('13:30') // Returns '1:30 PM'
 * formatTimeWithAMPM('09:05') // Returns '9:05 AM'
 * formatTimeWithAMPM('') // Returns ''
 */
function formatTimeWithAMPM(time) {
  // Return early if time is null, undefined or empty string
  if (!time || time === '') return '';

  try {
    // Extract hours and minutes from the time string
    let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

    // Validate hours and minutes
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error('Invalid time format');
    }

    // Default to 12-hour format
    let period = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    // Format the time string
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return time; // Return original time if there's an error
  }
}