import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';

export async function GET() {
    try {
        let dateAfter3Days = new Date();
        dateAfter3Days.setDate(dateAfter3Days.getDate() + 3);

        const params = {
            dateAfter3Days: { type: "DateTime", value: dateAfter3Days }
        };

        const query = `
            Select B.BookingID, MainRBID as RBID, sDate, DATEADD(day, 1, eDate) as eDate, B.*,
            (select (EM.FullName) from EJamaatMaster EM where EM.EJamaatID = B.eJamaatID) as Name,
            (Select RoomID from RoomBooking Where RBID = TT.MainRBID) as RoomID
            from (
                Select BookingID, MainRBID, Min(StartDate) as sDate, Max(EndDate) as eDate from (
                    select RBID, 
                           MainRBID = case when parentRoomID = 0 then RBID else ParentRoomID end,
                           StartDate, 
                           EndDate, 
                           BookingID 
                    from RoomBooking 
                    where Status = 'CheckedIn'
                ) T
                group by BookingID, MainRBID
            ) TT 
            Inner Join Booking B on TT.BookingID = B.BookingID 
            Where DATEADD(day, 1, eDate) Between (
                Select min(EndDate) from RoomBooking where Status = 'CheckedIn'
            ) and @dateAfter3Days
            order by eDate, RoomID desc
        `;

        const result = await executeQuery(query, params);

        return json(result);
    } catch (err) {
        console.log(err);
        return json({
            error: err
        });
    }
}
