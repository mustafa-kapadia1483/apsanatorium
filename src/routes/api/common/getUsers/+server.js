import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../../mssql.config';

export async function GET() {
	try {
		const pool = await sql.connect(config);

		const request = pool.request();
		
		const userListQuery = `SELECT DISTINCT UserID, UserName FROM dbo.Users`;
		const userListResult = await request.query(userListQuery);

		return json(userListResult.recordset);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
