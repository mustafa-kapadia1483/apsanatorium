import { json } from '@sveltejs/kit';
import { executeStoredProcedure } from '$lib/server/database';

export async function GET() {
	try {
		// Get Waitlist Report from stored procedure
		const result = await executeStoredProcedure('WaitListReport');

		return json(result.recordset[0]);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
