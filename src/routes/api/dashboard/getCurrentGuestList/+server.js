import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';

export async function GET() {
	const currentDate = new Date();

	try {
		const query = `
			SELECT 
				vbg.RBID,
				vbg.BGName,
				vbg.ejamaatId,
				vbg.RoomID, 
				vbg.BookingID,
				vrd.StartDate,
				DATEADD(Day,1,vrd.EndDate) AS EndDate 
			FROM vwBookingGuest vbg,vwRoomDetails vrd
			WHERE @currentDate between vrd.startdate AND DATEADD(day, 0, vrd.EndDate)
			AND vrd.Status in('CheckedIn','CheckedOut','Extra') 
			AND vrd.RoomIsFree='N' 
			AND vbg.RBID=vrd.RBID 
			AND vbg.BookingID=vrd.BookingID 
			AND vbg.BookingID in (
				SELECT vrd.BookingID 
				FROM vwRoomDetails vrd 
				WHERE @currentDate between vrd.startdate AND DATEADD(day, 0, vrd.EndDate) 
				AND vrd.Status in ('CheckedIn','CheckedOut','Extra') 
				AND vrd.RoomIsFree='N' 
				GROUP BY vrd.BookingID
			) 
			ORDER BY vbg.RoomID desc, vbg.Gender Desc`;

		const params = {
			currentDate: { type: "Date", value: currentDate }
		};

		const result = await executeQuery(query, params);

		return json(result);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
