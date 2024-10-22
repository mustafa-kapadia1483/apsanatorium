import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../../mssql.config';

export async function GET() {
	try {
		let pool = await sql.connect(config);

		let dateAfter3Days = new Date();
		dateAfter3Days.setDate(dateAfter3Days.getDate() + 3);

		let query = `
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

		let request = pool.request();
		request.input('dateAfter3Days', sql.DateTime, dateAfter3Days);

		let result = await request.query(query);

		return json(result.recordset);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
