<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import DashboardCardSmallHeading from '$lib/components/ui/dashboard/dashboard-card-small-heading.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import { strftime } from '$lib/utils/date-utils';

	export let data;

	let startDate = data.startDate || strftime('%F');
	let endDate = data.endDate || strftime('%F');
	let bookingId = data.bookingId;
	let showForfeit = data.showForfeit;
	let forfeitCondition = data.forfeitCondition;
	const { collectionReport, forfeitReport } = data.collectionReportData;

	const collectionReportTableHeaders = [
		'S.No.',
		'Date',
		'Guest Name',
		'Booking ID',
		'Rec Type',
		'Pay Type',
		'Rec No',
		'Amt-In',
		'Amt-Out',
		'Entered By'
	];

	const forfeitReportTableHeaders = [
		'S.No.',
		'Date',
		'Guest Name',
		'Room',
		'Remarks',
		'Amount',
		'Entered By'
	];
</script>

<div class="container border border-gray-300 px-0">
	<GradientHeader>Collection Report</GradientHeader>
	<form class="flex justify-between" method="POST">
		<div class="flex-1 pb-2 m-2 border border-blue-300 rounded-sm space-y-2">
			<DashboardCardSmallHeading>ON THE PERIOD</DashboardCardSmallHeading>
			<div class="px-2 space-y-2">
				<DateRangeSelector bind:startDate bind:endDate />
				<div class="flex gap-4">
					<div>
						<label for="reportType">Report Type</label>
						<select class="border border-gray-300 p-1" name="reportType" id="reportType">
							<option value="All">All</option>
							<option value="Advance">Advance</option>
							<option value="Rent">Rent</option>
							<option value="Refund">Refund</option>
						</select>
					</div>
					<div>
						<label for="paymentType">Payment Type</label>
						<select class="border border-gray-300 p-1" name="paymentType" id="paymentType">
							<option value="All">All</option>
							<option value="Cash">Cash</option>
							<option value="Cheque">Cheque</option>
							<option value="CreditCard">Credit Card</option>
						</select>
					</div>
					<div class="flex items-center">
						<input
							class="mr-2 -mb-1 inline-block"
							type="checkbox"
							name="showForfeit"
							id="showForfeit"
							bind:checked={showForfeit}
						/>
						<label for="showForfeit">Show Forfeit</label>
					</div>
					<div class="flex items-center gap-2">
						<label for="forfeitCondition">Forfeit Condition</label>
						<select
							class="border border-gray-300 p-1 disabled:opacity-50"
							name="forfeitCondition"
							id="forfeitCondition"
							disabled={!showForfeit}
							bind:value={forfeitCondition}
						>
							<option value="">All</option>
							<option value="> 0">Greater Than 0</option>
							<option value="= 0">Equal to 0</option>
						</select>
					</div>
				</div>
				<GradientButton>Search</GradientButton>
			</div>
		</div>
		<div class="pb-2 m-2 border border-blue-300 rounded-sm space-y-2">
			<DashboardCardSmallHeading>ON BOOKING</DashboardCardSmallHeading>
			<div class="px-2 space-y-2">
				<div>
					<label for="bookingId">Booking ID</label>
					<input
						class="border border-gray-300 p-1"
						type="text"
						name="bookingId"
						id="bookingId"
						bind:value={bookingId}
					/>
				</div>
				<GradientButton>Search</GradientButton>
			</div>
		</div>
	</form>
</div>

{#if collectionReport}
	<div class="container border border-gray-300 p-2 mt-2">
		<ReportTable
			class="my-2"
			tableHeaders={collectionReportTableHeaders}
			tableBody={collectionReport}
			fileName="CollectionReport"
			title={`
			Collection Report for the period from 
			${collectionReport[0].Date}
			to 
			${collectionReport.at(-2).Date}`}
		/>
	</div>
{/if}

{#if forfeitReport}
	<div class="container border border-gray-300 p-2 mt-2 mb-5">
		<ReportTable
			class="my-2"
			tableHeaders={forfeitReportTableHeaders}
			tableBody={forfeitReport}
			fileName="ForfeitReport"
			title={`Forfeit Report for the period from 
			${forfeitReport[0].Date}
			to 
			${forfeitReport.at(-2).Date}`}
		/>
	</div>
{/if}
