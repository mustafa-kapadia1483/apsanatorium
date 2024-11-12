import { strftime } from '$lib/utils/date-utils';

const mapZeroDepositGuestData = (item, index) => {
	// Calculate number of days between start and end date
	const startDate = new Date(item.SDate);
	const endDate = new Date(item.eDate);
	const dayStay = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

	// Calculate hours left if booking is not expired
	const hoursLeft = item.BookingExpiryDate ?
		Math.ceil((new Date(item.BookingExpiryDate) - new Date()) / (1000 * 60 * 60)) :
		"";

	return {
		"#": index + 1,
		"BookingID": item.BookingID,
		"Status": item.BookingStatus,
		"Name": item.Name,
		"Room(s)": item.Rooms,
		"Total Guest(s)": item.cntguest,
		"No. of Day Stay": dayStay,
		"Estimated Advance": item.TotAdvAmount,
		"Estimated Tax": item.Tax,
		"Estimated Total": item.TotAdvAmount + item.Tax,
		"Left Hours": hoursLeft,
		"Start Date": strftime('%d-%b-%Y', new Date(item.SDate))
	}
}

const TABLE_HEADERS = [
	"#",
	"BookingID",
	"Status",
	"Name",
	"Room(s)",
	"Total Guest(s)",
	"No. of Day Stay",
	"Estimated Advance",
	"Estimated Tax",
	"Estimated Total",
	"Left Hours",
	"Start Date"
];

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	let status = url.searchParams.get('status');
	let page = url.searchParams.get('page') || 1;


	if (!status) {
		return {
			status: "both",
			tableHeaders: TABLE_HEADERS
		};
	}

	const zeroDepositGuestData = await fetch(`${url.origin}/api/reports/zero-deposit-guest?${new URLSearchParams({
		status,
		page
	})}`
	).then((res) => res.json());

	const records = zeroDepositGuestData.records.map(mapZeroDepositGuestData);

	return {
		status,
		zeroDepositGuestData: records,
		tableHeaders: TABLE_HEADERS,
		pagination: zeroDepositGuestData.pagination
	};
}
