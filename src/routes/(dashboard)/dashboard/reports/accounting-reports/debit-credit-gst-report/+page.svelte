<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import { strftime } from '$lib/utils/date-utils';
	import { RadioGroup, RadioGroupItem, RadioGroupInput } from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	export let data;

	let startDate = data.startDate;
	let endDate = data.endDate;
	let reportType = data.reportType;
	const debitCreditGstReportData = data.debitCreditGstReportData;
	const tableHeaders = data.tableHeaders;
</script>

<div class="container border px-0 border-gray-200">
	<GradientHeader>Debit Credit GST Report</GradientHeader>
	<form
		class="w-3/4 mx-auto my-3 space-y-3"
		action="/dashboard/reports/accounting-reports/debit-credit-gst-report"
		data-sveltekit-reload
	>
		<DateRangeSelector bind:startDate bind:endDate />
		<div class="flex gap-2">
			<p class="text-sm font-bold">Type:</p>
			<RadioGroup bind:value={reportType} class="flex gap-2">
				<RadioGroupInput name="reportType" value={reportType} />
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="Credit" id="Credit" />
					<Label for="Credit">Credit</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="Debit" id="Debit" />
					<Label for="Debit">Debit</Label>
				</div>
			</RadioGroup>
		</div>
		<GradientButton>Search</GradientButton>
	</form>

	{#if debitCreditGstReportData}
		<ReportTable
			{tableHeaders}
			tableBody={debitCreditGstReportData}
			fileName={`${data.reportType.toLowerCase()}-gst-report`}
			title={`${data.reportType} GST Report From Date: ${strftime('%d-%b-%Y', new Date(data.startDate))} To: ${strftime(
				'%d-%b-%Y',
				new Date(data.endDate)
			)}`}
		/>
	{/if}
</div>
