import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../../mssql.config';

async function getFRID(roomTypeID, fromDate, numDays, pool) {
	try {
		// Create a request for executing the stored procedure
		const request = pool.request();

		// Add input parameters
		request.input('RoomTypeID', sql.BigInt, roomTypeID);
		request.input('FromDate', sql.Date, fromDate);
		request.input('NumDays', sql.Int, numDays);

		// Add output parameter
		request.output('FRID', sql.BigInt);

		// Execute the stored procedure
		const result = await request.execute('FindFreeRoom');

		// Return the output parameter FRID
		return result.output.FRID;
	} catch (err) {
		console.error('SQL error', err);
		return null;
	}
}

export async function GET() {
	const currentDate = new Date();

	try {
		let pool = await sql.connect(config);
		// Format current date to SQL format

		// Get Room Type IDs
		let query = 'Select RTID from dbo.fn_RoomType(getdate())';

		let result = await pool.request().query(query);

		// Call SQL Procedure to for Free Rooms
		let roomTypeIdsList = await Promise.all(
			result.recordset.map(async ({ RTID }) => await getFRID(RTID, currentDate, 1, pool))
		);

		query = `Select * from FreeRoomDetails Where FreeRoomID in (${roomTypeIdsList.join(', ')}) Order by RoomID desc`;
		result = await pool.request().query(query);

		return json(result.recordset.map(({ RoomID }) => RoomID));
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
