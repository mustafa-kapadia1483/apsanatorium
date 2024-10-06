import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../mssql.config';

export async function GET() {
	try {
		let pool = await sql.connect(config);

		// Get Waitlist Repot from stored procedure
		let currentDate = new Date();
		let dateAfter3Days = new Date();
		dateAfter3Days.setDate(dateAfter3Days.getDate() + 3);

		let query = `
			select BookingID, eJamaatID,BookingStatus,
			isnull((select top 1 (EM.FullName) from  EJamaatMaster EM where EM.EJamaatID=B.EJamaatID),'') as Name, 
			(Select top 1 StartDate from RoomBooking Where Status not in ('Cancelled','Extra') and BookingID = B.BookingID And ParentRoomID = 0 order by StartDate) as SDate, 
			(select Stuff((select  ', ' + RoomID   from (Select RoomID from RoomBooking Where Status not in ('Cancelled','Extra')  And ParentRoomID = 0 and BookingID = B.BookingID) T  FOR XML PATH ('')),1,2,'')) as RoomID
			from Booking B Where BookingID in 
			(select distinct BookingID from roombooking where DATEADD(day, 1,StartDate) Between @currentDate and @dateAfter3Days and Status = 'Booked' 
			and ParentRoomID = 0) And BookingStatus in ( 'Confirmed' ,'Provisional') order by BookingStatus desc,sDate
		`;

		let request = pool.request();
		request.input('currentDate', sql.DateTime, currentDate);
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