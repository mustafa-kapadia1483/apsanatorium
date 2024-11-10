import sql from 'mssql';
import { json } from '@sveltejs/kit';
import { executeQuery, executeStoredProcedure } from '$lib/server/database';

/**
 * Gets the Free Room ID (FRID) by calling the FindFreeRoom stored procedure
 * @param {number} roomTypeID - The room type ID to search for
 * @param {Date} fromDate - The starting date to check availability
 * @param {number} numDays - Number of days to check availability for
 * @returns {Promise<number|null>} The Free Room ID if found, null if error occurs
 */
async function getFRID(roomTypeID, fromDate, numDays) {
	const inputParams = {
		RoomTypeID: { type: sql.BigInt, value: roomTypeID },
		FromDate: { type: sql.Date, value: fromDate },
		NumDays: { type: sql.Int, value: numDays }
	};
	const outputParams = {
		FRID: sql.BigInt
	};

	try {
		const result = await executeStoredProcedure(
			'FindFreeRoom',
			inputParams,
			outputParams
		);

		return result.output.FRID;
	} catch (err) {
		console.error('SQL error', err);
		return null;
	}
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const currentDate = new Date();

	try {
		// Get Room Type IDs
		const roomTypes = await executeQuery('Select RTID from dbo.fn_RoomType(getdate())');

		// Call SQL Procedure for Free Rooms
		const roomTypeIdsList = await Promise.all(
			roomTypes.map(({ RTID }) => getFRID(RTID, currentDate, 1))
		);

		if (roomTypeIdsList.length === 0) {
			return json([]);
		}

		const freeRooms = await executeQuery(
			`Select * from FreeRoomDetails Where FreeRoomID in (${roomTypeIdsList.join(', ')}) Order by RoomID desc`
		);

		return json(freeRooms.map(({ RoomID }) => RoomID));
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}