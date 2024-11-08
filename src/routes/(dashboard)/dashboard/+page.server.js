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
	const baseUrl = `${url.origin}/api/dashboard`;
	const [
		currentGuestListResponse,
		todayFreeRoomsResponse,
		waitlistBookingReportResponse,
		roomStatusResponse,
		todaysCheckInResponse,
		saifeeRoomListResponse,
		todaysCheckOutResponse,
		earlyCheckOutResponse,
		stayRecordsToBeCreatedResponse,
		outStandingStayRecordsResponse,
		bookingsToBeConfirmedResponse,
		autoExpiredBookingsResponse,
		confirmedNotCheckedInResponse,
		guestWithZeroDepositResponse
	] = await Promise.all([
		fetch(`${baseUrl}/getCurrentGuestList`),
		fetch(`${baseUrl}/getTodayFreeRooms`),
		fetch(`${baseUrl}/getWaitlistBookingReport`),
		fetch(`${baseUrl}/getRoomStatus`),
		fetch(`${baseUrl}/getTodaysCheckIn`),
		fetch(`${baseUrl}/getSaifeeRoomList`),
		fetch(`${baseUrl}/getTodaysCheckOut`),
		fetch(`${baseUrl}/getEarlyCheckOut`),
		fetch(`${baseUrl}/getStayRecordsToBeCreated`),
		fetch(`${baseUrl}/getOutStandingStayRecords`),
		fetch(`${baseUrl}/getBookingsToBeConfirmed`),
		fetch(`${baseUrl}/getAutoExpiredBookings`),
		fetch(`${baseUrl}/getConfirmedNotCheckedIn`),
		fetch(`${baseUrl}/getGuestWithZeroDeposit`)
	]);

	const [
		currentGuestListArray,
		todayFreeRoomsArray,
		waitlistBookingReport,
		{ roomStatusArray, totalRoomsCount },
		todaysCheckInRaw,
		saifeeRoomListRaw,
		todaysCheckOutRaw,
		earlyCheckOutRaw,
		stayRecordsToBeCreatedArray,
		outStandingStayRecordsArray,
		bookingsToBeConfirmedRaw,
		autoExpiredBookingsRaw,
		pastConfirmedBookingsNotCheckedInRaw,
		guestWithZeroDepositRaw
	] = await Promise.all([
		currentGuestListResponse.json(),
		todayFreeRoomsResponse.json(),
		waitlistBookingReportResponse.json(),
		roomStatusResponse.json(),
		todaysCheckInResponse.json(),
		saifeeRoomListResponse.json(),
		todaysCheckOutResponse.json(),
		earlyCheckOutResponse.json(),
		stayRecordsToBeCreatedResponse.json(),
		outStandingStayRecordsResponse.json(),
		bookingsToBeConfirmedResponse.json(),
		autoExpiredBookingsResponse.json(),
		confirmedNotCheckedInResponse.json(),
		guestWithZeroDepositResponse.json()
	]);

	let todaysCheckInArray = todaysCheckInRaw.map(({ SDate, ...rest }) => {
		return { date: strftime('%d-%b-%g', new Date(SDate)), ...rest };
	});

	let todaysCheckInObject = groupBy(todaysCheckInArray, 'BookingStatus');

	for (let key of Object.keys(todaysCheckInObject)) {
		todaysCheckInObject[key] = groupBy(todaysCheckInObject[key], 'date');
	}

	let saifeeRoomList = saifeeRoomListRaw.map(({ SDate, ...rest }) => {
		return { date: strftime('%d-%b-%g', new Date(SDate)), ...rest };
	});

	let todaysCheckOutList = todaysCheckOutRaw.map(({ eDate, ...rest }) => {
		return { eDate: strftime('%d-%b-%g', new Date(eDate)), ...rest };
	});

	let todaysCheckOutObject = groupBy(todaysCheckOutList, 'eDate');

	let earlyCheckOutList = earlyCheckOutRaw.map(({ eDate, ...rest }) => {
		return { eDate: strftime('%d-%b-%g', new Date(eDate)), ...rest };
	});

	let earlyCheckOutObject = groupBy(earlyCheckOutList, 'eDate');

	let bookingsToBeConfirmedArray = bookingsToBeConfirmedRaw.map(({ TimeStamp, ...rest }) => {
		const BOOKING_EXPIRES_IN_DAYS = 3;
		let timeStampDate = new Date(TimeStamp);
		timeStampDate.setDate(timeStampDate.getDate() + BOOKING_EXPIRES_IN_DAYS);

		return {
			expireDate: strftime('%e-%b-%Y', timeStampDate),
			...rest
		};
	});

	let autoExpiredBookingsArray = autoExpiredBookingsRaw.map(({ BookingExpiryDate, ...rest }) => {
		return {
			expiredDate: strftime('%e-%b-%Y', new Date(BookingExpiryDate[0])),
			...rest
		};
	});

	let pastConfirmedBookingsNotCheckedInArray = pastConfirmedBookingsNotCheckedInRaw.map(
		({ SDate, ...rest }) => {
			return {
				checkInDate: strftime('%e-%b-%Y', new Date(SDate)),
				...rest
			};
		}
	);

	let guestWithZeroDepositArray = guestWithZeroDepositRaw.map(({ sDate, ...rest }) => {
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
