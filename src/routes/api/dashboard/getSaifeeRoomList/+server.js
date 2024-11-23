import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';

export async function GET() {
	try {
		const date2DaysAgo = new Date();
		date2DaysAgo.setDate(date2DaysAgo.getDate() - 2);

		const date2DaysInFuture = new Date();
		date2DaysInFuture.setDate(date2DaysInFuture.getDate() + 2);

		const params = {
			date2DaysAgo: { type: "Date", value: date2DaysAgo },
			date2DaysInFuture: { type: "Date", value: date2DaysInFuture }
		};

		const query = `
            Select RB.BookingID, EM.eJamaatID,EM.FullName as Name,RB.StartDate as SDate,RB.RoomID 
            from RoomBooking RB 
            Left Outer join Booking B on B.BookingID=RB.BookingID 
            left Outer join EJamaatMaster EM on EM.EJamaatID=B.EJamaatID 
            Where RB.Package='Saifee' 
            and RB.StartDate Between @date2DaysAgo and @date2DaysInFuture 
            and RB.Status in ('Booked','Checked') 
            and RB.RoomISFree='N' 
            and RB.ParentRoomID = 0
        `;

		const result = await executeQuery(query, params);

		return json(result);
	} catch (err) {
		console.log(err);
		return json({
			error: err
		});
	}
}
