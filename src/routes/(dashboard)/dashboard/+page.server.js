import { error } from '@sveltejs/kit';
import strftime from '../../../utils/strftime';
import groupBy from '../../../utils/groupBy';

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

// Function to convert Room status to desired format
function convertRoomStatusArray(roomStatusArray, totalRoomsCount) {
	return roomStatusArray.map((item) => {
		const { TheDay, Booked, Occupied, Blocked } = item;
		const theDay = new Date(TheDay); // Parse the date
		const today = new Date(); // Get today's date

		return {
			date: strftime('%d-%b', theDay), // Format date as 'DD-MMM'
			day: strftime('%a', theDay), // Get day of the week as short name (e.g., 'Tue')
			isToday: theDay.toDateString() === today.toDateString(), // Check if the date is today
			booked: Booked,
			occupied: Occupied,
			blocked: Blocked,
			available: totalRoomsCount - Booked - Occupied - Blocked // Calculate available rooms
		};
	});
}

export async function load({ params, url }) {
	let response = await fetch(`${url.origin}/api/getCurrentGuestList`);
	const currentGuestListArray = await response.json();

	response = await fetch(`${url.origin}/api/getTodayFreeRooms`);
	const todayFreeRoomsArray = await response.json();

	response = await fetch(`${url.origin}/api/getWaitlistBookingReport`);
	const waitlistBookingReport = await response.json();

	response = await fetch(`${url.origin}/api/getRoomStatus`);
	const { roomStatusArray, totalRoomsCount } = await response.json();

	response = await fetch(`${url.origin}/api/getTodaysCheckIn`);
	let todaysCheckInArray = await response.json();

	todaysCheckInArray = todaysCheckInArray.map(({ SDate, ...rest }) => {
		return { date: strftime('%d-%b-%g', new Date(SDate)), ...rest };
	});

	let todaysCheckInObject = groupBy(todaysCheckInArray, 'BookingStatus');

	for (let key of Object.keys(todaysCheckInObject)) {
		todaysCheckInObject[key] = groupBy(todaysCheckInObject[key], 'date');
	}

	response = await fetch(`${url.origin}/api/getSaifeeRoomList`);
	let saifeeRoomList = await response.json();

	saifeeRoomList = saifeeRoomList.map(({ SDate, ...rest }) => {
		return { date: strftime('%d-%b-%g', new Date(SDate)), ...rest };
	});

	return {
		currentGuestListArray: convertBookings(currentGuestListArray),
		todayFreeRoomsArray,
		waitlistBookingReport,
		roomStatusArray: convertRoomStatusArray(roomStatusArray, totalRoomsCount),
		todaysCheckInObject,
		saifeeRoomList
	};
}
