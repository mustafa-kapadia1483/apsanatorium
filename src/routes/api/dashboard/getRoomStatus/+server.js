import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../../mssql.config';

export async function GET() {
	try {
		let pool = await sql.connect(config);
		let request = pool.request();

		let fetchDate = new Date();
		fetchDate.setDate(fetchDate.getDate() - 1);

		let query = '';
		for (let i = 1; i <= 9; i++) {
			let dateName = `date_${i}`;
			if (query.length > 0) query += ' Union';
			query += ` Select cast(@${dateName} as DateTime) as TheDay, 
			(select count(rbid) as cnt from RoomBooking inner join Rooms  on RoomBooking.RoomID=Rooms.RoomID Where IsActive='Y' and @${dateName} between StartDate and EndDate And Status = 'Booked') as Booked, 
			(select count(rbid) as cnt from RoomBooking inner join Rooms  on RoomBooking.RoomID=Rooms.RoomID Where IsActive='Y' and @${dateName} between StartDate and EndDate And Status in ('CheckedIn','CheckedOut') and  RoomIsFree='N') as Occupied, 
			(select count(rbid) as cnt from RoomBooking inner join Rooms  on RoomBooking.RoomID=Rooms.RoomID Where IsActive='Y' and @${dateName} between StartDate and EndDate And Status = 'Blocked') as Blocked
			`;

			request.input(dateName, sql.DateTime, new Date(fetchDate));
			fetchDate.setDate(fetchDate.getDate() + 1);
		}

		query += ' Order by TheDay';

		// Get Waitlist Repot from stored procedure
		let result = await request.query(query);
		let roomStatusArray = result.recordset;

		query = `Select count(RoomID) as cnt from Rooms Where IsActive = 'Y'`;
		result = await request.query(query);

		let totalRoomsCount = result.recordset[0].cnt;

		return json({ roomStatusArray, totalRoomsCount });
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
