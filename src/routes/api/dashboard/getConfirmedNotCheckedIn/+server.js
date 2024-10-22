import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../../mssql.config';

export async function GET() {
	try {
		let pool = await sql.connect(config);

		let currentDate = new Date();

		let query = `
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

		let request = pool.request();
		request.input('currentDate', sql.DateTime, currentDate);
		let result = await request.query(query);

		return json(result.recordset);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
