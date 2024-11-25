<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { strftime } from '$lib/utils/date-utils';
	import DateInput from '$lib/components/ui/date-input.svelte';

	export let data;

	const zafafBookingData = data.zafafBookingData;

	let { startDate, endDate, sortBy } = data.params;

	const sortByOptions = [
    { value: "CreatedDate", label: "Created Date" },
    { value: "BookingFromDate", label: "Booking From Date" },
    { value: "BookingToDate", label: "Booking To Date" },
  ];
</script>

<div class="container border px-0 border-gray-200 mb-4">
	<GradientHeader>Zafaf Booking Report</GradientHeader>
	<form
		class="w-3/4 mx-auto py-4 space-y-3"
		action="/dashboard/reports/working-reports/zafaf-booking"
		data-sveltekit-reload
	>
		<div class="flex gap-4 items-center">
			<div class="flex gap-2 items-center">
				<Label for="sortBy">Sort By:</Label>
				<select name="sortBy" id="sortBy" value={sortBy} class="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
					<option value="CreatedDate">Created Date</option>
					<option value="BookingFromDate">Booking From Date</option>
				</select>
			</div>

			<div class="flex gap-2 items-center">
				<Label for="startDate">From:</Label>
				<DateInput id="startDate" name="startDate" value={startDate} />
			</div>

			<div class="flex gap-2 items-center">
				<Label for="endDate">To:</Label>
				<DateInput id="endDate" name="endDate" value={endDate} />
			</div>
		</div>
		<GradientButton>Search</GradientButton>
	</form>
	{#if zafafBookingData}
		<ReportTable
			fileName={'Zafaf-Booking-Report'}
			title={`Zafar Booking Report from ${strftime('%d-%b-%Y', new Date(data.params.startDate))} to ${strftime('%d-%b-%Y', new Date(data.params.endDate))}`}
			tableBody={zafafBookingData}
			containerClass="mt-4"
		/>
	{/if}
</div>
