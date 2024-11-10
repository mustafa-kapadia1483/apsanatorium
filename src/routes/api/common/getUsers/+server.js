import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';

export async function GET() {
	try {
		const query = `SELECT DISTINCT UserID, UserName FROM dbo.Users`;

		const result = await executeQuery(query);

		return json(result);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
