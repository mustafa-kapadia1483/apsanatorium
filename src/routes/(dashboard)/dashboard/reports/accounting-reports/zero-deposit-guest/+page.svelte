<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import { strftime } from '$lib/utils/date-utils';
	import { RadioGroup, RadioGroupItem, RadioGroupInput } from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import TablePagination from '$lib/components/ui/table-pagination.svelte';
	import { goto, afterNavigate } from '$app/navigation';
	export let data;

	let status;
	let zeroDepositGuestData;
	const tableHeaders = data.tableHeaders;

	let currentPage;
	const totalPages = data.pagination?.totalPages;

	let zeroDepositGuestForm;

	afterNavigate(() => {
		status = data.status;
		zeroDepositGuestData = data.zeroDepositGuestData;

		currentPage = data.pagination?.page;
	});

	function handlePageChange(page) {
		goto(`?page=${page}&status=${status}`, { noScroll: true });
	}
</script>

<div class="container border px-0 border-gray-200">
	<GradientHeader>Zero Deposit Guest</GradientHeader>
	<form
		class="w-3/4 mx-auto my-3"
		action="/dashboard/reports/accounting-reports/zero-deposit-guest"
		bind:this={zeroDepositGuestForm}
		data-sveltekit-reload
	>
		<div class="flex justify-center items-center gap-2">
			<p class="text-sm font-bold">Status:</p>
			<RadioGroup bind:value={status} class="flex gap-2">
				<RadioGroupInput name="status" value={status} />
				<input type="hidden" name="page" value={currentPage} />
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="both" id="both" />
					<Label for="both">Both</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="confirmed" id="confirmed" />
					<Label for="confirmed">Confirmed</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="provisional" id="provisional" />
					<Label for="provisional">Provisional</Label>
				</div>
			</RadioGroup>
			<GradientButton>Search</GradientButton>
		</div>
	</form>

	{#if zeroDepositGuestData}
		<ReportTable
			{tableHeaders}
			tableBody={zeroDepositGuestData}
			fileName="zero-deposit-guest"
			title={`Report for Guests with Zero Deposit as on ${strftime('%d-%b-%Y')}`}
		/>

		<TablePagination bind:currentPage {totalPages} onPageChange={handlePageChange} />
	{/if}
</div>
