<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import { strftime } from '$lib/utils/date-utils';
	export let data;

	let startDate = data.startDate;
	let endDate = data.endDate;
	const unAdjustedAdvancesReportData = data.unAdjustedAdvancesReportData;
	const tableHeaders = data.tableHeaders;
</script>

<div class="container border px-0 border-gray-200">
	<GradientHeader>Unadjusted Amount Report</GradientHeader>
	<form
		class="w-3/4 mx-auto my-3"
		action="/dashboard/reports/unadjusted-amount-report"
		data-sveltekit-reload
	>
		<DateRangeSelector bind:startDate bind:endDate />
		<GradientButton>Search</GradientButton>
	</form>

	{#if unAdjustedAdvancesReportData}
		<ReportTable
			{tableHeaders}
			tableBody={unAdjustedAdvancesReportData}
			fileName="unadjusted-amount-report"
			title={`Unadjusted Amount From Date: ${strftime('%d-%b-%Y', new Date(data.startDate))} To: ${strftime(
				'%d-%b-%Y',
				new Date(data.endDate)
			)}`}
			statsContainerClass="w-4/12 mx-auto mt-4"
			exportButtonClass="text-xs px-2 py-1"
			tableClass="w-4/12 mx-auto"
			headerRowClass="h-auto"
			headerCellClass="p-0 border border-gray-200 px-1 font-bold text-black"
			bodyCellClass="p-0 border border-gray-200 px-1"
		/>
	{/if}
</div>
