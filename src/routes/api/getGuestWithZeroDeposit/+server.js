import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../mssql.config';

export async function GET() {
	try {
		let pool = await sql.connect(config);

		let query = `
				SELECT *
				FROM (
					SELECT B.*,
						ISNULL(EM.FullName, '') AS Name,
						ISNULL((SELECT SUM(OC.Amount) FROM dbo.OtherCharges OC WHERE OC.ChargeType = 'Advance' AND OC.BookingID = B.BookingID), 0) AS AdvAmount,
						ISNULL((SELECT SUM(RB.RBID) FROM dbo.RoomBooking RB WHERE RB.Status IN ('Booked', 'CheckedIn') AND RB.BookingID = B.BookingID), 0) AS Rooms,
						ISNULL((SELECT MIN(StartDate) FROM RoomBooking WHERE BookingID = B.BookingID AND Status NOT IN ('Cancelled', 'Extra')), '') AS sDate
					FROM Booking B
					LEFT OUTER JOIN EJamaatMaster EM ON B.eJamaatID = EM.eJamaatID
					WHERE B.BookingStatus IN ('Confirmed')
				) T
				WHERE T.AdvAmount = 0
				AND T.Rooms > 0
				ORDER BY sDate;
		`;

		let request = pool.request();
		let result = await request.query(query);

		return json(result.recordset);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
