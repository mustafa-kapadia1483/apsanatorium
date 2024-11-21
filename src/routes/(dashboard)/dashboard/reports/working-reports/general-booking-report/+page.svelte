<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import { RadioGroup, RadioGroupItem, RadioGroupInput } from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import { strftime } from '$lib/utils/date-utils';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';

	export let data;

	const bookingSource = data.params.bookingSource;
	const status = data.params.status;
	const advanceType = data.params.advanceType;
	const bookingType = data.params.bookingType;
	const generalBookingReportData = data.generalBookingReportData;

	let startDate = data.params.startDate;
	let endDate = data.params.endDate;
</script>

<div class="container border px-0 border-gray-200">
	<GradientHeader>Booking Reports</GradientHeader>
	<form
		class="w-3/4 mx-auto flex flex-col gap-4 py-4"
		action="/dashboard/reports/working-reports/general-booking-report"
		data-sveltekit-reload
	>
		<div class="flex gap-2">
			<RadioGroup value={bookingType} class="flex gap-2">
				<RadioGroupInput name="bookingType" value={bookingType} />
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="Booked" id="Booked" />
					<Label for="Booked">Booked</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="RoomStart" id="RoomStart" />
					<Label for="RoomStart">Room Start</Label>
				</div>
			</RadioGroup>
		</div>
		<DateRangeSelector bind:startDate bind:endDate />
		<div class="flex gap-2">
			<p class="text-sm font-bold">Booking Source:</p>
			<RadioGroup value={bookingSource} class="flex gap-2">
				<RadioGroupInput name="bookingSource" value={bookingSource} />
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="Admin,Online" id="booking-source-all" />
					<Label for="booking-source-all">All</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="Online" id="Online" />
					<Label for="Online">Online Booking</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="Admin" id="Admin" />
					<Label for="Admin">Walkin Booking</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="Wedding" id="Wedding" />
					<Label for="Wedding">Saifee</Label>
				</div>
			</RadioGroup>
		</div>
		<div class="flex gap-2">
			<p class="text-sm font-bold">Status:</p>
			<RadioGroup value={status} class="flex gap-2">
				<RadioGroupInput name="status" value={status} />
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="Provisional,Confirmed,Cancelled" id="status-all" />
					<Label for="status-all">All</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="Confirmed" id="Confirmed" />
					<Label for="Confirmed">Confirmed</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="Provisional" id="Provisional" />
					<Label for="Provisional">Provisional</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="CancelbyAPS" id="CancelbyAPS" />
					<Label for="CancelbyAPS">Cancel by APS</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="ExpiryOnline" id="ExpiryOnline" />
					<Label for="ExpiryOnline">Expiry Online</Label>
				</div>
			</RadioGroup>
		</div>
		<div class="flex gap-2">
			<p class="text-sm font-bold">Advance:</p>
			<RadioGroup value={advanceType} class="flex gap-2">
				<RadioGroupInput name="advanceType" value={advanceType} />
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="All" id="advance-all" />
					<Label for="advance-all">All</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="ZeroDeposit" id="ZeroDeposit" />
					<Label for="ZeroDeposit">Zero Deposit</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="WithDeposit" id="WithDeposit" />
					<Label for="WithDeposit">With Deposit</Label>
				</div>
			</RadioGroup>
		</div>
		<GradientButton class="w-fit">Search</GradientButton>
	</form>

	{#if generalBookingReportData}
		<ReportTable
			title={`Booking Report from ${strftime('%d-%b-%Y', new Date(data.params.startDate))} to ${strftime('%d-%b-%Y', new Date(data.params.endDate))}`}
			tableBody={generalBookingReportData}
		/>
	{/if}
</div>
