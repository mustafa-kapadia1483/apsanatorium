import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../../mssql.config';

export async function GET() {
	try {
		let pool = await sql.connect(config);

		let query = `
            SELECT 
                BookingID, 
                eJamaatID, 
                BookingStatus,
                ISNULL((
                    SELECT TOP 1 EM.FullName 
                    FROM EJamaatMaster EM 
                    WHERE EM.EJamaatID = B.EJamaatID
                ), '') AS Name,
                (
                    SELECT TOP 1 StartDate 
                    FROM RoomBooking 
                    WHERE Status NOT IN ('Cancelled', 'Extra') 
                    AND BookingID = B.BookingID 
                    AND ParentRoomID = 0 
                    ORDER BY StartDate
                ) AS SDate,
                (
                    SELECT STUFF((
                        SELECT ', ' + RoomID 
                        FROM (
                            SELECT RoomID 
                            FROM RoomBooking 
                            WHERE Status IN ('CheckedOut')  
                            AND StayRecID = 0 
                            AND BookingID = B.BookingID
                        ) T
                        FOR XML PATH ('')), 1, 2, ''
                    )
                ) AS RoomID
            FROM Booking B 
            WHERE BookingID IN (
                SELECT DISTINCT BookingID 
                FROM RoomBooking 
                WHERE Status IN ('CheckedOut')  
                AND StayRecID = 0
            ) 
            AND BookingStatus IN ('Confirmed') 
            AND BookingID NOT IN (
                'B11-14', 'B12-1316', 'B13-12', 'B13-615', 'B13-1028', 'B14-808', 
                'B15-1116', 'B15-1096', 'B16-454', 'B16-1105'
            ) 
            ORDER BY BookingStatus DESC, SDate;
        `;

		let request = pool.request();
		let result = await request.query(query);

		return json(result.recordset);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
