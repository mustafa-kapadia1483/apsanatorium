<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import { strftime } from '$lib/utils/date-utils';
	export let data;

	const outstandingReportData = data.outstandingReportData;
	const tableHeaders = data.tableHeaders;
</script>

<div class="container border px-0 border-gray-200">
	<GradientHeader>Short Stay Record Report</GradientHeader>
	<form
		class="w-3/4 mx-auto my-3"
		action="/dashboard/reports/outstanding-report"
		data-sveltekit-reload
	>
		<div class="flex gap-2 items-center justify-center">
			<label for="bookingId">Booking ID:</label>
			<input
				type="text"
				value={data.bookingId}
				name="bookingId"
				class="h-6 border border-gray-300 rounded-md p-0.5"
			/>
			<GradientButton>Search</GradientButton>
		</div>
	</form>

	{#if outstandingReportData}
		<ReportTable
			{tableHeaders}
			tableBody={outstandingReportData}
			fileName="outstanding-report"
			title={`Outstanding Report ${data.bookingId ? `for Booking ID: ${data.bookingId}` : ''}`.trim()}
		/>
	{/if}
</div>
