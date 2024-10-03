import { error } from '@sveltejs/kit';

// Function to format date to 'DD-MMM-YYYY'
function formatDate(dateString) {
	const options = { day: '2-digit', month: 'short', year: 'numeric' };
	const date = new Date(dateString);
	return date.toLocaleDateString('en-GB', options).replace(',', '');
}

// Function to convert bookings to desired format
function convertBookings(bookings) {
	const result = [];

	// Grouping bookings by RoomID
	const groupedBookings = bookings.reduce((acc, booking) => {
		if (!acc[booking.RoomID]) {
			acc[booking.RoomID] = {
				roomId: booking.RoomID,
				startDate: booking.StartDate,
				endDate: booking.EndDate,
				bookingId: booking.BookingID,
				guestList: []
			};
		}

		acc[booking.RoomID].guestList.push({
			name: booking.BGName,
			eJamaatID: booking.ejamaatId.toString() // Ensure eJamaatID is a string
		});

		return acc;
	}, {});

	// Converting the grouped object to an array
	for (const key in groupedBookings) {
		const bookingInfo = groupedBookings[key];
		result.push({
			roomId: bookingInfo.roomId,
			startDate: formatDate(bookingInfo.startDate),
			endDate: formatDate(bookingInfo.endDate),
			bookingId: bookingInfo.bookingId,
			guestList: bookingInfo.guestList
		});
	}

	return result;
}

export async function load({ params, url }) {
	let response = await fetch(`${url.origin}/api/getCurrentGuestList`);
	const currentGuestListArray = await response.json();

	response = await fetch(`${url.origin}/api/getTodayFreeRooms`);
	const todayFreeRoomsArray = await response.json();

	response = await fetch(`${url.origin}/api/getWaitlistBookingReport`);
	const waitlistBookingReport = await response.json();

	return {
		currentGuestListArray: convertBookings(currentGuestListArray),
		todayFreeRoomsArray,
		waitlistBookingReport
	};
}
