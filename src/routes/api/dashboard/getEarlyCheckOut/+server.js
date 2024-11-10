import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import sql from 'mssql';

export async function GET() {
    try {
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        let dateAfter3Days = new Date();
        dateAfter3Days.setDate(dateAfter3Days.getDate() + 3);

        const query = `
            SELECT 
                B.BookingID, 
                MainRBID as RBID, 
                sDate, 
                DATEADD(day, 1, eDate) as eDate, 
                B.*, 
                (SELECT EM.FullName 
                 FROM EJamaatMaster EM 
                 WHERE EM.EJamaatID = B.eJamaatID) as Name,
                (SELECT RoomID 
                 FROM RoomBooking 
                 WHERE RBID = TT.MainRBID) as RoomID
            FROM (
                SELECT 
                    BookingID, 
                    MainRBID, 
                    MIN(StartDate) as sDate, 
                    MAX(EndDate) as eDate 
                FROM (
                    SELECT 
                        RBID, 
                        CASE 
                            WHEN ParentRoomID = 0 THEN RBID 
                            ELSE ParentRoomID 
                        END as MainRBID, 
                        StartDate, 
                        EndDate, 
                        BookingID, 
                        (SELECT FinalTotal - ISNULL((
                            SELECT SUM(Amount) 
                            FROM dbo.ReceiptDetails 
                            WHERE StayRecID = StayRecord.StayRecID
                        ), 0) 
                        FROM dbo.StayRecord 
                        WHERE StayRecID = RoomBooking.StayRecID) as Balance
                    FROM 
                        RoomBooking 
                    WHERE 
                        Status IN ('CheckedOut', 'Extra') 
                        AND StayRecID > 0 
                        AND DATEADD(day, 1, EndDate) >= @currentDate
                ) T 
                WHERE T.Balance = 0 
                GROUP BY BookingID, MainRBID
            ) TT 
            INNER JOIN Booking B ON TT.BookingID = B.BookingID 
            WHERE DATEADD(day, 1, eDate) BETWEEN @currentDate AND @dateAfter3Days 
            ORDER BY eDate, RoomID DESC;
        `;

        const params = {
            currentDate: { type: sql.Date, value: currentDate },
            dateAfter3Days: { type: sql.Date, value: dateAfter3Days }
        };

        const result = await executeQuery(query, params);

        return json(result);
    } catch (err) {
        console.log(err);
        return json({
            error: err
        });
    }
}
