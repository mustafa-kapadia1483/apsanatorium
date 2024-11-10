import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';

export async function GET() {
	try {
		const query = `
			SELECT B.*, 
				ISNULL((EM.FullName),'') as Name 
			FROM Booking B 
			LEFT OUTER JOIN EJamaatMaster EM 
				ON B.ejamaatID = EM.ejamaatID 
			WHERE B.BookingStatus = 'Provisional' 
			ORDER BY B.BookingExpiryDate
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
