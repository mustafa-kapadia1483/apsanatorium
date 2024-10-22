import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../../mssql.config';

export async function GET() {
	try {
		let pool = await sql.connect(config);

		let query = `
            SELECT 
                T.*, 
                (T.FinalTotal - T.Paid + T.CDPaid) AS Balance, 
                EM.FullName AS Name, 
                EM.eJamaatID  
            FROM (
                SELECT 
                    SR.*, 
                    ISNULL((
                        SELECT SUM(Amount) 
                        FROM dbo.ReceiptDetails RD 
                        WHERE RD.StayRecID = SR.StayRecID
                    ), 0) AS Paid, 
                    ISNULL((
                        SELECT SUM(CalCulatedAmount) 
                        FROM DebitCreditNote DCN 
                        WHERE DCN.StayRecID = SR.StayRecID
                    ), 0) AS CDPaid  
                FROM StayRecord SR
            ) T 
            LEFT OUTER JOIN dbo.Booking B ON B.BookingID = T.BookingID 
            LEFT OUTER JOIN EJamaatMaster EM ON B.ejamaatID = EM.ejamaatID 
            WHERE (T.FinalTotal - T.Paid + CDPaid) <> 0;
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
