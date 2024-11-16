<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import { strftime } from '$lib/utils/date-utils';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import Input from '$lib/components/ui/input.svelte';
	export let data;

	let startDate = data.startDate;
	let endDate = data.endDate;
	let bookingId = data.bookingId || '';
	let ejaamaatId = data.ejaamaatId || '';
	const selectedTypes = data.selectedTypes || [];
	const cancellationReportData = data.cancellationReportData;
	const tableHeaders = data.tableHeaders;
</script>

<div class="container border px-0 border-gray-200">
	<GradientHeader>Cancellation Report</GradientHeader>
	<form
		class="w-3/4 mx-auto my-3 space-y-2"
		action="/dashboard/reports/cancellation-report"
		data-sveltekit-reload
	>
		<DateRangeSelector bind:startDate bind:endDate />
		<div class="flex items-center gap-2">
			<label for="bookingId">Booking ID</label>
			<Input id="bookingId" name="bookingId" bind:value={bookingId} />
		</div>
		<div class="flex items-center gap-2">
			<label for="ejaamaatId">Ejamaat ID</label>
			<Input id="ejaamaatId" name="ejaamaatId" bind:value={ejaamaatId} />
		</div>
		<div class="flex gap-2">
			<div class="flex items-center gap-2.5">
				<Checkbox
					checked={selectedTypes.includes('Stay Record')}
					name="selectedType"
					value="Stay Record"
				/>
				<Label>Stay Record</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox checked={selectedTypes.includes('Advance')} name="selectedType" value="Advance" />
				<Label>Advance</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox checked={selectedTypes.includes('Receipt')} name="selectedType" value="Receipt" />
				<Label>Receipt</Label>
			</div>
			<div class="flex items-center gap-2">
				<Checkbox
					checked={selectedTypes.includes('All') || selectedTypes.length === 0}
					name="selectedType"
					value="All"
				/>
				<Label>All</Label>
			</div>
		</div>
		<GradientButton>Search</GradientButton>
	</form>

	{#if cancellationReportData}
		<ReportTable
			{tableHeaders}
			tableBody={cancellationReportData}
			fileName="cancellation-report"
			title={`Cancellation Report From Date: ${strftime('%d-%b-%Y', new Date(data.startDate))} To: ${strftime(
				'%d-%b-%Y',
				new Date(data.endDate)
			)}`}
		/>
	{/if}
</div>
