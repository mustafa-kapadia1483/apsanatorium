<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import { strftime } from '$lib/utils/date-utils';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import DateInput from '$lib/components/ui/date-input.svelte';

	export let data;

	const startDate = data.params.startDate;
	const endDate = data.params.endDate;
	const guestRegisterData = data.guestRegisterData;
</script>

<div class="container border px-0 border-gray-200 mb-4">
	<GradientHeader>Guest Register</GradientHeader>
	<form
		class="w-3/4 mx-auto py-4 grid place-items-center"
		action="/dashboard/reports/working-reports/guest-register"
		data-sveltekit-reload
	>
		<div>
			<div class="inline-flex items-center gap-2">
				<label for="startDate">Start Date:</label>
				<DateInput type="date" name="startDate" id="startDate" value={startDate} />
			</div>
			<div class="inline-flex items-center gap-2 ml-2">
				<label for="endDate">End Date:</label>
				<DateInput type="date" name="endDate" id="endDate" value={endDate} />
			</div>
			<GradientButton class="ml-4">Search</GradientButton>
		</div>
	</form>

	{#if guestRegisterData}
		<ReportTable
			title={`Booking Report from ${strftime('%d-%b-%Y', new Date(data.params.startDate))} to ${strftime('%d-%b-%Y', new Date(data.params.endDate))}`}
			tableBody={guestRegisterData}
			containerClass="mt-4"
		/>
	{/if}
</div>
