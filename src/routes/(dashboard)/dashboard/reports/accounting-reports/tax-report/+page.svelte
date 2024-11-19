<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import { RadioGroup, RadioGroupItem, RadioGroupInput } from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import { strftime } from '$lib/utils/date-utils';

	export let data;

	let startDate = data.startDate || strftime('%F');
	let endDate = data.endDate || strftime('%F');
	let reportType = data.reportType;
	let paymentType = data.paymentType;

	const taxReportData = data.taxReportData;
	const tableHeaders = data.tableHeaders;
</script>

<div class="container border border-gray-300 px-0">
	<GradientHeader>Tax Report</GradientHeader>
	<form
		class="w-3/4 mx-auto"
		action="/dashboard/reports/accounting-reports/tax-report"
		data-sveltekit-reload
	>
		<div class="px-2 my-4 space-y-3">
			<DateRangeSelector bind:startDate bind:endDate />
			<div class="flex gap-2">
				<p class="text-sm font-bold">Status:</p>
				<RadioGroup bind:value={reportType} class="flex gap-2">
					<RadioGroupInput name="reportType" value={reportType} />
					<div class="flex items-center space-x-2">
						<RadioGroupItem value="Advance" id="Advance" />
						<Label for="Advance">Advance</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value="Rent" id="Rent" />
						<Label for="Rent">Rent</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value="Refund" id="Refund" />
						<Label for="Refund">Refund</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value="All" id="reportType-all" />
						<Label for="reportType-all">All</Label>
					</div>
				</RadioGroup>
			</div>
			<div class="flex gap-2">
				<p class="text-sm font-bold">Payment Type:</p>
				<RadioGroup bind:value={paymentType} class="flex gap-2">
					<RadioGroupInput name="paymentType" value={paymentType} />
					<div class="flex items-center space-x-2">
						<RadioGroupItem value="Cash" id="Cash" />
						<Label for="Cash">Cash</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value="Cheque" id="Cheque" />
						<Label for="Cheque">Cheque</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value="CreditCard" id="CreditCard" />
						<Label for="CreditCard">Credit Card</Label>
					</div>
					<div class="flex items-center space-x-2">
						<RadioGroupItem value="All" id="paymentType-all" />
						<Label for="paymentType-all">All</Label>
					</div>
				</RadioGroup>
			</div>
			<GradientButton>Search</GradientButton>
		</div>
	</form>
</div>

{#if taxReportData}
	<div class="container border border-gray-300 p-2 mt-2">
		<ReportTable
			class="my-2"
			{tableHeaders}
			tableBody={taxReportData}
			fileName="tax-report"
			title={`
			Tax Report for the period from 
			${taxReportData[0]?.Date || strftime('%d-%b-%Y', new Date(data.startDate))}
			to 
			${taxReportData.at(-2)?.Date || strftime('%d-%b-%Y', new Date(data.endDate))}`}
		/>
	</div>
{/if}
