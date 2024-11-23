<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import ReportTable from '$lib/components/ui/report-table.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { strftime } from '$lib/utils/date-utils';

	export let data;

	const guestRoomWise = data.guestRoomWise;

	let { startDate, endDate } = data.params;
	const { guestName, ejammatId, roomId } = data.params;
</script>

<div class="container border px-0 border-gray-200 mb-4">
	<GradientHeader>Guest/Room-wise Report</GradientHeader>
	<form
		class="w-3/4 mx-auto py-4 space-y-3"
		action="/dashboard/reports/working-reports/guest-room-wise"
		data-sveltekit-reload
	>
		<div class="flex justify-between">
			<div class="flex items-center gap-2">
				<Label for="guestName">Guest Name:</Label>
				<Input value={guestName} name="guestName" id="guestName" />
			</div>
			<div class="flex items-center gap-2">
				<Label for="ejammatId">Ejammat ID:</Label>
				<Input value={ejammatId} name="ejammatId" id="ejammatId" />
			</div>
			<div class="flex items-center gap-2">
				<Label for="roomId">Room ID:</Label>
				<Input value={roomId} name="roomId" id="roomId" />
			</div>
		</div>
		<DateRangeSelector bind:startDate bind:endDate />
		<GradientButton>Search</GradientButton>
	</form>
	{#if guestRoomWise}
		<ReportTable
			fileName={'Guest-Room-Wise-Report'}
			title={`Guest Room Wise Report from ${strftime('%d-%b-%Y', new Date(data.params.startDate))} to ${strftime('%d-%b-%Y', new Date(data.params.endDate))}`}
			tableBody={guestRoomWise}
			containerClass="mt-4"
		/>
	{/if}
</div>
