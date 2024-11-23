import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import { strftime, formatTimeWithAMPM } from '$lib/utils/date-utils';

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

      const dateParam = { date: { type: "Date", value: date } };
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