import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../../mssql.config';

export async function GET() {
	try {
		const pool = await sql.connect(config);
		const request = pool.request();

		const queries = []
		for (let i = -1; i < 8; i++) {
			const dateName = `date_${i >= 0 ? i : 'm' + Math.abs(i)}`;
			let fetchDate = new Date();
			fetchDate.setDate(fetchDate.getDate() + i);

			queries.push(`
          SELECT 
            CAST(@${dateName} AS DATETIME) as TheDay,
            (SELECT COUNT(rb.RBID) 
             FROM RoomBooking rb
             INNER JOIN Rooms r ON rb.RoomID = r.RoomID 
             WHERE r.IsActive = 'Y' 
             AND @${dateName} BETWEEN rb.StartDate AND rb.EndDate 
             AND rb.Status = 'Booked') as Booked,
            
            (SELECT COUNT(rb.RBID)
             FROM RoomBooking rb 
             INNER JOIN Rooms r ON rb.RoomID = r.RoomID
             WHERE r.IsActive = 'Y'
             AND @${dateName} BETWEEN rb.StartDate AND rb.EndDate
             AND rb.Status IN ('CheckedIn','CheckedOut')
             AND rb.RoomIsFree = 'N') as Occupied,
             
            (SELECT COUNT(rb.RBID)
             FROM RoomBooking rb
             INNER JOIN Rooms r ON rb.RoomID = r.RoomID
             WHERE r.IsActive = 'Y'
             AND @${dateName} BETWEEN rb.StartDate AND rb.EndDate
             AND rb.Status = 'Blocked') as Blocked
        `)

			request.input(dateName, sql.Date, fetchDate);
		}


		const roomStatusQuery = queries.join(' UNION ') + ' ORDER BY TheDay'
		const totalRoomsQuery = `Select count(RoomID) as cnt from Rooms Where IsActive = 'Y'`;

		// Get Waitlist Repot from stored procedure
		const [roomStatusResult, totalRoomsResult] = await Promise.all([
			request.query(roomStatusQuery),
			request.query(totalRoomsQuery)
		]);

		const roomStatusArray = roomStatusResult.recordset;
		const totalRoomsCount = totalRoomsResult.recordset[0].cnt;

		return json({ roomStatusArray, totalRoomsCount });
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
