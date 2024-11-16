<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import { strftime } from '$lib/utils/date-utils';
	export let data;

	let startDate = data.startDate;
	let endDate = data.endDate;
	const stayReportData = data.stayReportData;
	const tableHeaders = data.tableHeaders;
</script>

<div class="container border px-0 border-gray-200">
	<GradientHeader>Stay Record Report</GradientHeader>
	<form class="w-3/4 mx-auto my-3" action="/dashboard/reports/stay-report" data-sveltekit-reload>
		<DateRangeSelector bind:startDate bind:endDate />
		<GradientButton>Search</GradientButton>
	</form>

	{#if stayReportData}
		<ReportTable
			{tableHeaders}
			tableBody={stayReportData}
			fileName="stay-report"
			title={`Stay Report From Date: ${strftime('%d-%b-%Y', new Date(data.startDate))} To: ${strftime(
				'%d-%b-%Y',
				new Date(data.endDate)
			)}`}
		/>
	{/if}
</div>
