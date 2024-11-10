import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';

export async function GET() {
	try {
		const query = `
			SELECT B.*, 
				ISNULL((EM.FullName),'') as Name,
				BookingExpiryDate 
			FROM Booking B 
			LEFT OUTER JOIN EJamaatMaster EM 
				ON B.ejamaatID = EM.ejamaatID 
			WHERE B.BookingStatus = 'Cancelled' 
				AND cancelledby = 'AutoExpiry' 
				AND DATEDIFF(dd, CAST(B.BookingExpiryDate as date), CAST(GETDATE() as date)) <= 3 
			ORDER BY B.BookingExpiryDate DESC
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
