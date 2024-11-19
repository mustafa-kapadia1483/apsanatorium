import { strftime } from '$lib/utils/date-utils';

const mapSaifeeRoomReportData = (item, index) => {
	return {
		"#": index + 1,
		"BookingID": item.BookingID,
		"Name": item.FullName,
		"EjamaatID": item.eJamaatID,
		"Room No.": item.RoomID,
		"SDate": item.StartDate,
		"EDate": item.EndDate,
		"Room Rent": item.RoomRentTotal,
		"Saifee Exp.": item.WeddExp,
		"Tax": item.TotTax,
		"GrandTotal": item.GrandTotal
	}
}

const TABLE_HEADERS = [
	"#",
	"BookingID",
	"Name",
	"EjamaatID",
	"Room No.",
	"SDate",
	"EDate",
	"Room Rent",
	"Saifee Exp.",
	"Tax",
	"GrandTotal"
];

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	let startDate = url.searchParams.get('startDate');
	let endDate = url.searchParams.get('endDate');

	if (!startDate || !endDate) {
		return {
			startDate: strftime('%F'),
			endDate: strftime('%F'),
			saifeeRoomReportData: null,
			tableHeaders: TABLE_HEADERS
		};
	}

	const saifeeRoomReportData = await fetch(`${url.origin}/api/reports/accounting-reports/saifee-room-report?${new URLSearchParams({
		startDate,
		endDate,
	})}`
	).then(res => res.json());

	const records = saifeeRoomReportData.map(mapSaifeeRoomReportData);

	return {
		startDate,
		endDate,
		saifeeRoomReportData: records,
		tableHeaders: TABLE_HEADERS
	};
}
