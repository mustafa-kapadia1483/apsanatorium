import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../mssql.config';

export async function GET() {
	try {
		let pool = await sql.connect(config);

		let request = pool.request();

		const date2DaysAgo = new Date();
		date2DaysAgo.setDate(date2DaysAgo.getDate() - 2);

		const date2DaysInFuture = new Date();
		date2DaysInFuture.setDate(date2DaysInFuture.getDate() + 2);

		// Query Saifee Rooms List
		let query = `Select RB.BookingID, EM.eJamaatID,EM.FullName as Name,RB.StartDate as SDate,RB.RoomID from RoomBooking RB 
         Left Outer join Booking B on B.BookingID=RB.BookingID left Outer join EJamaatMaster EM on EM.EJamaatID=B.EJamaatID 
         Where RB.Package='Saifee' and RB.StartDate Between @date2DaysAgo and @date2DaysInFuture and RB.Status in  ('Booked','Checked') and RB.RoomISFree='N' and RB.ParentRoomID = 0`;

		request.input('date2DaysAgo', sql.DateTime, date2DaysAgo);
		request.input('date2DaysInFuture', sql.DateTime, date2DaysInFuture);

		let result = await request.query(query);

		return json(result.recordset);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
