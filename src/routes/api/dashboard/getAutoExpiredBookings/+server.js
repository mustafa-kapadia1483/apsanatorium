import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../../mssql.config';

export async function GET() {
	try {
		let pool = await sql.connect(config);

		let query = `select B.*,isnull((EM.FullName),'') as Name,BookingExpiryDate from Booking B Left Outer join EJamaatMaster EM On B.ejamaatID=EM.ejamaatID Where B.BookingStatus = 'Cancelled' and cancelledby='AutoExpiry' and datediff(dd,Cast(B.BookingExpiryDate as date),Cast(getdate() as date))<=3 order by B.BookingExpiryDate desc`;

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
