import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import { adjustDateByDays } from '$lib/utils/date-utils';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    try {
        const roomId = url.searchParams.get('roomId');
        const date = url.searchParams.get('date');

        if (!roomId || !date) {
            throw error(400, 'roomId, date and status are required parameters');
        }

        // First query to get room booking details
        const roomBookingQuery = `
            SELECT * FROM dbo.RoomBooking 
            WHERE Status NOT IN ('Cancelled') 
            AND RoomID = @roomId 
            AND @date BETWEEN StartDate AND EndDate 
            ORDER BY StartDate DESC, EndDate DESC, RoomIsFree
        `;

        const inputParams = {
            roomId: {
                type: 'VarChar',
                value: roomId
            },
            date: {
                type: 'Date',
                value: date
            }
        };

        const roomBooking = await executeQuery(roomBookingQuery, inputParams); 

        if (roomBooking.length === 0) {
            return json({ status: 'empty' });
        }

        const { RBID, Status, BookingID } = roomBooking[0];

        // Second query to get detailed booking information
        const bookingDetailsQuery = `
            SELECT 
                RB.*,
                ISNULL(B.eJamaatID, 0) as eJamaatID,
                EM.FullName as Name,
                BookedBy,
                ISNULL((
                    SELECT COUNT(BGID) 
                    FROM dbo.BookingGuest BG 
                    WHERE BG.RBID = RB.RBID 
                    AND BG.BookingID = RB.BookingID
                ), 0) as CntPerson,
                ISNULL((
                    SELECT Remark 
                    FROM dbo.RoomBlock M 
                    WHERE M.BlockID = RB.BookingID
                ), '') as Remark
            FROM dbo.RoomBooking RB
            LEFT OUTER JOIN dbo.Booking B ON B.BookingID = RB.BookingID
            LEFT OUTER JOIN dbo.EJamaatMaster EM ON B.eJamaatID = EM.eJamaatID
            WHERE RB.RBID = @RBID
        `;

        const bookingDetails = await executeQuery(bookingDetailsQuery, {
            RBID: {
                type: 'VarChar',
                value: RBID
            }
        });

        if(bookingDetails[0]) {
            bookingDetails[0].StartDate = new Date(bookingDetails[0].StartDate);
            // Checkout is next day hence adding 1 day
            bookingDetails[0].EndDate = adjustDateByDays(new Date(bookingDetails[0].EndDate), 1);
            return json(bookingDetails[0]);
        }

        return json({ status: 'error', message: 'No booking details found' });

    } catch (err) {
        console.error(err);
        throw error(500, err.message);
    }
}
