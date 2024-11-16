<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import { strftime } from '$lib/utils/date-utils';
	export let data;

	let startDate = data.startDate;
	let endDate = data.endDate;
	const shortStayReportData = data.shortStayReportData;
	const tableHeaders = data.tableHeaders;
</script>

<div class="container border px-0 border-gray-200">
	<GradientHeader>Short Stay Record Report</GradientHeader>
	<form
		class="w-3/4 mx-auto my-3"
		action="/dashboard/reports/short-stay-report"
		data-sveltekit-reload
	>
		<DateRangeSelector bind:startDate bind:endDate />
		<GradientButton>Search</GradientButton>
	</form>

	{#if shortStayReportData}
		<ReportTable
			{tableHeaders}
			tableBody={shortStayReportData}
			fileName="short-stay-report"
			title={`Short Stay Report From Date: ${strftime('%d-%b-%Y', new Date(data.startDate))} To: ${strftime(
				'%d-%b-%Y',
				new Date(data.endDate)
			)}`}
		/>
	{/if}
</div>
