<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import { strftime } from '$lib/utils/date-utils';
	import { RadioGroup, RadioGroupItem, RadioGroupInput } from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import {
		Pagination,
		PaginationContent,
		PaginationItem,
		PaginationLink,
		PaginationPrevButton,
		PaginationNextButton,
		PaginationEllipsis
	} from '$lib/components/ui/pagination';
	import { goto } from '$app/navigation';
	export let data;

	let status = data.status;
	let zeroDepositGuestData = data.zeroDepositGuestData;
	const tableHeaders = data.tableHeaders;

	let currentPage = data.pagination?.page;
	const totalPages = data.pagination?.totalPages;

	let zeroDepositGuestForm;

	function handlePageChange() {
		const url = new URL(window.location);
		url.searchParams.set('page', currentPage);
		url.searchParams.set('status', status);
		window.location.href = url.toString();
	}
</script>

<div class="container border px-0 border-gray-200">
	<GradientHeader>Zero Deposit Guest</GradientHeader>
	<form
		class="w-3/4 mx-auto my-3"
		action="/dashboard/reports/zero-deposit-guest"
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

		<Pagination
			bind:page={currentPage}
			count={totalPages}
			perPage={1}
			siblingCount={2}
			let:pages
			onPageChange={handlePageChange}
		>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevButton />
				</PaginationItem>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					{:else}
						<PaginationItem>
							<PaginationLink {page} isActive={currentPage === page.value}>
								{page.value}
							</PaginationLink>
						</PaginationItem>
					{/if}
				{/each}
				<PaginationItem>
					<PaginationNextButton />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	{/if}
</div>
