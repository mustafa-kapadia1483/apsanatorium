import sql from 'mssql';
import { json } from '@sveltejs/kit';
import config from '../../../../../mssql.config';

function formatDateToSQL(date) {
	const padZero = (num) => (num < 10 ? '0' + num : num);
	const year = date.getFullYear();
	const month = padZero(date.getMonth() + 1); // Months are 0-indexed
	const day = padZero(date.getDate());
	return `${year}-${month}-${day}`;
}

export async function GET() {
	const currentDate = new Date();

	try {
		let pool = await sql.connect(config);
		// Format current date to SQL format
		let query =
			'SELECT vbg.RBID,vbg.BGName,vbg.ejamaatId,vbg.RoomID, vbg.BookingID,vrd.StartDate,DATEADD(Day,1,vrd.EndDate) AS EndDate FROM vwBookingGuest vbg,vwRoomDetails vrd' +
			' WHERE @currentDate between vrd.startdate AND DATEADD(day, 0, vrd.EndDate)  ' +
			" AND vrd.Status in('CheckedIn','CheckedOut','Extra') and vrd.RoomIsFree='N' and  vbg.RBID=vrd.RBID AND vbg.BookingID=vrd.BookingID AND " +
			" vbg.BookingID in (SELECT vrd.BookingID FROM vwRoomDetails vrd WHERE @currentDate between vrd.startdate AND DATEADD(day, 0, vrd.EndDate) AND vrd.Status in ('CheckedIn','CheckedOut','Extra') and vrd.RoomIsFree='N' group by vrd.BookingID ) order by vbg.RoomID desc, vbg.Gender Desc";

		let result = await pool
			.request()
			.input('currentDate', sql.DateTime, currentDate) // Pass the current date as a DateTime parameter
			.query(query);

		return json(result.recordset);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
