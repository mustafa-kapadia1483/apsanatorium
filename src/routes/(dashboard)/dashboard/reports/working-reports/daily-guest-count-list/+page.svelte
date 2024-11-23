<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import { strftime } from '$lib/utils/date-utils';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import DateInput from '$lib/components/ui/date-input.svelte';

	export let data;

	const { startDate, endDate } = data.params;
	const dailyGuestCountListData = data.dailyGuestCountListData;
</script>

<div class="container border px-0 border-gray-200 mb-4">
	<GradientHeader>Daily Guest Count List</GradientHeader>
	<form
		class="w-3/4 mx-auto py-4 grid place-items-center"
		action="/dashboard/reports/working-reports/daily-guest-count-list"
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

	{#if dailyGuestCountListData}
		<ReportTable
			title={`Daily Guest Count List from ${strftime('%d-%b-%Y', new Date(data.params.startDate))} to ${strftime('%d-%b-%Y', new Date(data.params.endDate))}`}
			tableBody={dailyGuestCountListData}
			containerClass="mt-4 w-1/2 mx-auto mb-4"
			titleClass="mb-3"
			bodyRowClass="last:font-bold"
		/>
	{/if}
</div>
