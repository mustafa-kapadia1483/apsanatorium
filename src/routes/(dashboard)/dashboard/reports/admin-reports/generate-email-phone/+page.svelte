<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import { RadioGroup, RadioGroupItem, RadioGroupInput } from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';
	import Input from '$lib/components/ui/input.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import TablePagination from '$lib/components/ui/table-pagination.svelte';
	import { goto, afterNavigate } from '$app/navigation';

	export let data;

	let { ejaamatId, email, name, contact, guestType } = data.params;
	let emailPhoneData = data.emailPhoneData ?? null;
	let currentPage = data?.pagination?.currentPage || 1;

	const totalPages = data.pagination?.totalPages;
	afterNavigate(() => {
		({ ejaamatId, email, name, contact, guestType } = data.params);
		emailPhoneData = data.emailPhoneData ?? null;
		currentPage = data?.pagination?.currentPage || 1;
	});

	function handlePageChange(page) {
		goto(`?page=${page}&guestType=${guestType}`, { noScroll: true });
	}
</script>

<div class="container border px-0 border-gray-200">
	<GradientHeader>Generate Email/Phone</GradientHeader>
	<form
		class="my-3 flex flex-col gap-4 items-center"
		action="/dashboard/reports/admin-reports/generate-email-phone"
		data-sveltekit-reload
	>
		<div class="flex gap-2">
			<p class="text-sm font-bold">Guest Type:</p>
			<RadioGroup value={guestType} class="flex gap-2">
				<RadioGroupInput name="guestType" value={guestType} />
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="current" id="current" />
					<Label for="current">Current Guest</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroupItem value="all" id="all" />
					<Label for="all">All Guest</Label>
				</div>
			</RadioGroup>
		</div>
		<div class="grid grid-flow-col gap-8">
			<div class="space-y-2">
				<div class="flex gap-2 items-center justify-end">
					<Label for="ejaamatId">Ejaamat Id:</Label>
					<Input id="ejaamatId" name="ejaamatId" value={ejaamatId} />
				</div>
				<div class="flex gap-2 items-center justify-end">
					<Label for="email">Email:</Label>
					<Input id="email" name="email" value={email} />
				</div>
			</div>
			<div class="space-y-2">
				<div class="flex gap-2 items-center justify-end">
					<Label for="name">Name:</Label>
					<Input id="name" name="name" value={name} />
				</div>
				<div class="flex gap-2 items-center justify-end">
					<Label for="contact">Contact No:</Label>
					<Input id="contact" name="contact" value={contact} />
				</div>
			</div>
		</div>
		<GradientButton class="w-fit">Search</GradientButton>
	</form>

	{#if emailPhoneData}
		<ReportTable
			title={`${guestType === 'current' ? 'Current' : 'All'} Guest List Email/Phone`}
			tableBody={emailPhoneData}
		/>
		<TablePagination bind:page={currentPage} {totalPages} onPageChange={handlePageChange} />
	{/if}
</div>
