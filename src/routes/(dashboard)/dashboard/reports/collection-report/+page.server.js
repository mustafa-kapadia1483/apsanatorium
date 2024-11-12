/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	let startDate = url.searchParams.get('startDate');
	let endDate = url.searchParams.get('endDate');
	const bookingId = url.searchParams.get('bookingId') || '';
	const reportType = url.searchParams.get('reportType') || 'All';
	const paymentType = url.searchParams.get('paymentType') || 'All';
	const showForfeit = url.searchParams.get('showForfeit') == "on";
	const forfeitCondition = url.searchParams.get('forfeitCondition') || '';

	let collectionReportData = {};
	if (startDate && endDate) {
		const collectionReport = await fetch(`${url.origin}/api/reports/collection-report?${new URLSearchParams({
			startDate,
			endDate,
			bookingId,
			reportType,
			paymentType,
			showForfeit,
			forfeitCondition,
		})}`);
		collectionReportData = await collectionReport.json();

		collectionReportData.collectionReport = collectionReportData.collectionReport.map((item, index) => {
			return {
				"S.No.": index + 1,
				"Date": item.CollectionDate,
				"Guest Name": item.GuestName,
				"Booking ID": item.BookingID,
				"Rec Type": item.RecType,
				"Pay Type": item.PayType,
				"Rec No": item.ReceiptID,
				"Amt-In": item.amountIn,
				"Amt-Out": item.amountOut,
				"Entered By": item.UserID,
			}
		});

		// Add total amount row so that it can be exported to excel & shown in the table
		if (collectionReportData.collectionReport.length > 0) {
			collectionReportData.collectionReport.push({
				'S.No.': '',
				Date: '',
				'Guest Name': '',
				'Booking ID': '',
				'Rec Type': '',
				'Pay Type': '',
				'Rec No': 'Total Amount',
				'Amt-In': collectionReportData.totalCollection.amountIn,
				'Amt-Out': collectionReportData.totalCollection.amountOut,
				'Entered By': ''
			});
		}

		// Add forfeit report data to the collection report data only if it exists
		if (collectionReportData.hasOwnProperty('forfeitReport')) {
			collectionReportData.forfeitReport = collectionReportData.forfeitReport.map((item, index) => {
				return {
					"S.No.": index + 1,
					"Date": item.ForfeitedDate,
					"Guest Name": item.GuestName,
					"Room": item.RoomID,
					"Remarks": item.Remarks,
					"Amount": item.ForfeitedAmount,
					"Entered By": item.UserID,
				}
			});

			if (collectionReportData.forfeitReport.length > 0) {
				collectionReportData.forfeitReport.push({
					'S.No.': '',
					Date: '',
					'Guest Name': '',
					Room: '',
					Remarks: 'Total Amount',
					Amount: collectionReportData.totalForfeit,
					'Entered By': '',
				})
			}
		}


	}

	return {
		startDate,
		endDate,
		bookingId,
		collectionReportData,
		reportType,
		paymentType,
		showForfeit,
		forfeitCondition,
	};
}
