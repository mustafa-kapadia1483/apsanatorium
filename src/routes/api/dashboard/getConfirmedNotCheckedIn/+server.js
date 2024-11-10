import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import sql from 'mssql';

export async function GET() {
	try {
		let currentDate = new Date();

		const query = `
				SELECT BookingID, eJamaatID,
					ISNULL(
						(SELECT EM.FullName FROM EJamaatMaster EM WHERE EM.EJamaatID = B.EJamaatID), ''
					) AS Name,
					(SELECT TOP 1 StartDate FROM RoomBooking WHERE BookingID = B.BookingID ORDER BY StartDate) AS SDate
				FROM Booking B
				WHERE BookingID IN (
					SELECT DISTINCT BookingID
					FROM RoomBooking
					WHERE StartDate < @currentDate
					AND Status = 'Booked'
					AND ParentRoomID = 0
				)
				AND BookingStatus = 'Confirmed'
				ORDER BY SDate;
		`;

		const params = {
			currentDate: { type: sql.DateTime, value: currentDate }
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
