import { error } from '@sveltejs/kit';
import { strftime } from '$lib/utils/date-utils';
import groupBy from '$lib/utils/groupBy';

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
	let response = await fetch(`${url.origin}/api/dashboard/getCurrentGuestList`);
	const currentGuestListArray = await response.json();

	response = await fetch(`${url.origin}/api/dashboard/getTodayFreeRooms`);
	const todayFreeRoomsArray = await response.json();

	response = await fetch(`${url.origin}/api/dashboard/getWaitlistBookingReport`);
	const waitlistBookingReport = await response.json();

	response = await fetch(`${url.origin}/api/dashboard/getRoomStatus`);
	const { roomStatusArray, totalRoomsCount } = await response.json();

	response = await fetch(`${url.origin}/api/dashboard/getTodaysCheckIn`);
	let todaysCheckInArray = await response.json();

	todaysCheckInArray = todaysCheckInArray.map(({ SDate, ...rest }) => {
		return { date: strftime('%d-%b-%g', new Date(SDate)), ...rest };
	});

	let todaysCheckInObject = groupBy(todaysCheckInArray, 'BookingStatus');

	for (let key of Object.keys(todaysCheckInObject)) {
		todaysCheckInObject[key] = groupBy(todaysCheckInObject[key], 'date');
	}

	response = await fetch(`${url.origin}/api/dashboard/getSaifeeRoomList`);
	let saifeeRoomList = await response.json();

	saifeeRoomList = saifeeRoomList.map(({ SDate, ...rest }) => {
		return { date: strftime('%d-%b-%g', new Date(SDate)), ...rest };
	});

	response = await fetch(`${url.origin}/api/dashboard/getTodaysCheckOut`);
	let todaysCheckOutList = await response.json();

	todaysCheckOutList = todaysCheckOutList.map(({ eDate, ...rest }) => {
		return { eDate: strftime('%d-%b-%g', new Date(eDate)), ...rest };
	});

	let todaysCheckOutObject = groupBy(todaysCheckOutList, 'eDate');

	response = await fetch(`${url.origin}/api/dashboard/getEarlyCheckOut`);
	let earlyCheckOutList = await response.json();

	earlyCheckOutList = earlyCheckOutList.map(({ eDate, ...rest }) => {
		return { eDate: strftime('%d-%b-%g', new Date(eDate)), ...rest };
	});

	let earlyCheckOutObject = groupBy(earlyCheckOutList, 'eDate');

	response = await fetch(`${url.origin}/api/dashboard/getStayRecordsToBeCreated`);
	let stayRecordsToBeCreatedArray = await response.json();

	response = await fetch(`${url.origin}/api/dashboard/getOutStandingStayRecords`);
	let outStandingStayRecordsArray = await response.json();

	response = await fetch(`${url.origin}/api/dashboard/getBookingsToBeConfirmed`);
	let bookingsToBeConfirmedArray = await response.json();

	bookingsToBeConfirmedArray = bookingsToBeConfirmedArray.map(({ TimeStamp, ...rest }) => {
		const BOOKING_EXPIRES_IN_DAYS = 3;
		let timeStampDate = new Date(TimeStamp);
		timeStampDate.setDate(timeStampDate.getDate() + BOOKING_EXPIRES_IN_DAYS);

		return {
			expireDate: strftime('%e-%b-%Y', timeStampDate),
			...rest
		};
	});

	response = await fetch(`${url.origin}/api/dashboard/getAutoExpiredBookings`);
	let autoExpiredBookingsArray = await response.json();

	autoExpiredBookingsArray = autoExpiredBookingsArray.map(({ BookingExpiryDate, ...rest }) => {
		return {
			expiredDate: strftime('%e-%b-%Y', new Date(BookingExpiryDate[0])),
			...rest
		};
	});

	response = await fetch(`${url.origin}/api/dashboard/getConfirmedNotCheckedIn`);
	let pastConfirmedBookingsNotCheckedInArray = await response.json();

	pastConfirmedBookingsNotCheckedInArray = pastConfirmedBookingsNotCheckedInArray.map(
		({ SDate, ...rest }) => {
			return {
				checkInDate: strftime('%e-%b-%Y', new Date(SDate)),
				...rest
			};
		}
	);

	response = await fetch(`${url.origin}/api/dashboard/getGuestWithZeroDeposit`);
	let guestWithZeroDepositArray = await response.json();

	guestWithZeroDepositArray = guestWithZeroDepositArray.map(({ sDate, ...rest }) => {
		return {
			startDate: strftime('%e-%b-%Y', new Date(sDate)),
			...rest
		};
	});

	const guestWithZeroDepositObject = groupBy(guestWithZeroDepositArray, 'startDate');

	return {
		currentGuestListArray: convertBookings(currentGuestListArray),
		todayFreeRoomsArray,
		waitlistBookingReport,
		roomStatusArray: convertRoomStatusArray(roomStatusArray, totalRoomsCount),
		todaysCheckInObject,
		saifeeRoomList,
		todaysCheckOutObject,
		earlyCheckOutObject,
		stayRecordsToBeCreatedArray,
		outStandingStayRecordsArray,
		bookingsToBeConfirmedArray,
		autoExpiredBookingsArray,
		pastConfirmedBookingsNotCheckedInArray,
		guestWithZeroDepositObject
	};
}
