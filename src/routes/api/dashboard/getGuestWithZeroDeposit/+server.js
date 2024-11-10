import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';

export async function GET() {
	try {
		const query = `
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

		const result = await executeQuery(query);

		return json(result);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
