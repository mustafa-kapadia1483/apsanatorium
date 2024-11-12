import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';

export const GET = async ({ url }) => {
  try {
    const status = url.searchParams.get('status') || 'both';
    const page = parseInt(url.searchParams.get('page')) || 1;
    const pageSize = 100;
    const offset = (page - 1) * pageSize;

    // Build status condition
    let statusCondition = '';
    switch (status) {
      case 'both':
        statusCondition = "AND B.BookingStatus in ('Confirmed','Provisional')";
        break;
      case 'confirmed':
        statusCondition = "AND B.BookingStatus in ('Confirmed')";
        break;
      case 'provisional':
        statusCondition = "AND B.BookingStatus in ('Provisional')";
        break;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total FROM (
        SELECT B.BookingID
        FROM Booking B
        WHERE B.Bookedby IN ('Admin','Online')
        ${statusCondition}
        AND ISNULL((SELECT SUM(OC.Amount) FROM dbo.OtherCharges OC 
            WHERE OC.ChargeType='Advance' AND OC.BookingID=B.BookingID), 0) = 0
      ) T`;

    const countResult = await executeQuery(countQuery);
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Main query with pagination
    const query = `
            SELECT * FROM (
                SELECT B.*,
                    ISNULL(EM.FullName,'') as Name,
                    EM.ContactNos,
                    EM.MobileNo,
                    EM.eMail,
                    ISNULL((SELECT SUM(OC.Amount) FROM dbo.OtherCharges OC 
                        WHERE OC.ChargeType='Advance' AND OC.BookingID=B.BookingID), 0) as TotAdvAmount,
                    ISNULL((SELECT COUNT(BG.BGID) FROM BookingGuest BG 
                        WHERE BG.BookingID=B.BookingID), 0) as cntguest,
                    ISNULL((SELECT COUNT(RBID) FROM dbo.RoomBooking 
                        WHERE ParentRoomID=0 AND BookingID=B.BookingID), 0) as Rooms,
                    ISNULL((SELECT MIN(Startdate) FROM dbo.RoomBooking 
                        WHERE BookingID=B.BookingID), 0) as SDate,
                    ISNULL((SELECT MAX(Enddate) FROM dbo.RoomBooking 
                        WHERE BookingID=B.BookingID), 0) as eDate
                FROM Booking B
                LEFT OUTER JOIN EJamaatMaster EM ON B.ejamaatID=EM.ejamaatID
                WHERE B.Bookedby IN ('Admin','Online')
                ${statusCondition}
            ) T 
            WHERE T.TotAdvAmount = 0
            ORDER BY T.BookingID ASC
            OFFSET ${offset} ROWS
            FETCH NEXT ${pageSize} ROWS ONLY`;

    const result = await executeQuery(query);

    return json({
      records: result,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalRecords
      }
    });

  } catch (err) {
    console.error('Database error:', err);
    return json({ error: 'Internal Server Error' }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
    );
  }
};
