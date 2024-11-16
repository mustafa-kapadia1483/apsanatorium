import { strftime } from '$lib/utils/date-utils';

const mapCancellationData = (item, index) => {
	return {
		"#": index + 1,
		"Receipt Date": strftime('%d-%b-%Y', new Date(item["Receipt Date"])),
		"Receipt Type": item["Receipt Type"],
		"Receipt ID": item["Receipt ID"],
		"BookingID": item["BookingID"],
		"Name": item["FullName"],
		"EjamaatID": item["EjamaatID"],
		"SubTotal": item["SubTotal"],
		"SubTotal Tax": item["SubTotal Tax"],
		"Final Amount": item["Final Amount"]
	}
}

const TABLE_HEADERS = [
	"#",
	"Receipt Date",
	"Receipt Type",
	"Receipt ID",
	"BookingID",
	"Name",
	"EjamaatID",
	"SubTotal",
	"SubTotal Tax",
	"Final Amount"
];

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	let startDate = url.searchParams.get('startDate');
	let endDate = url.searchParams.get('endDate');
	const selectedTypes = url.searchParams.getAll('selectedType');
	const bookingId = url.searchParams.get('bookingId');
	const ejaamaatId = url.searchParams.get('ejaamaatId');

	if (!startDate || !endDate) {
		return {
			startDate: strftime('%F'),
			endDate: strftime('%F'),
		};
	}

	const cancellationReportData = await fetch(`${url.origin}/api/reports/cancellation-report?${new URLSearchParams({
		startDate,
		endDate,
		bookingId,
		ejaamaatId,
		selectedTypes: selectedTypes.join(',')
	})}`
	).then(res => res.json());

	return {
		startDate,
		endDate,
		bookingId,
		ejaamaatId,
		selectedTypes,
		cancellationReportData: cancellationReportData.map(mapCancellationData),
		tableHeaders: TABLE_HEADERS
	};
}
