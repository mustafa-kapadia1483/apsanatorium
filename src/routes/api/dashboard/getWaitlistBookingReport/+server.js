import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../../mssql.config';

export async function GET() {
	try {
		let pool = await sql.connect(config);

		// Get Waitlist Repot from stored procedure
		let result = await pool.request().execute('WaitListReport');

		return json(result.recordset[0]);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
