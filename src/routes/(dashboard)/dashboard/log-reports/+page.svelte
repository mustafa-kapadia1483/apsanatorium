<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DashboardCardSmallHeading from '$lib/components/ui/dashboard/dashboard-card-small-heading.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	export let data;

	const logReportArray = data.logReport || [];
	const users = data.users || [];

	function handleBookingIdInput(event) {
		// Only allow alphanumeric characters and hyphen
		const input = event.target;
		const sanitizedValue = input.value.replace(/[^a-zA-Z0-9-]/g, '');
		if (input.value !== sanitizedValue) {
			input.value = sanitizedValue;
		}
	}
</script>

<div class="container border px-0">
	<GradientHeader>Log Report</GradientHeader>
	<form class="py-4 bg-alternate_background" method="POST">
		<div class="w-3/4 mx-auto space-y-2">
			<div class="flex justify-between">
				<div>
					<label for="bookingId">Booking ID:</label>
					<input
						type="text"
						name="bookingId"
						id="bookingId"
						class="border"
						on:input={handleBookingIdInput}
					/>
				</div>
				<div>
					<label for="user">User:</label>
					<select name="user" id="user" class="border">
						<option value="">Select User</option>
						{#each users as { UserID, UserName }}
							<option value={UserID}>{UserName}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="keyword">Keyword:</label>
					<input type="text" name="keyword" id="keyword" class="border" />
				</div>
			</div>
			<DateRangeSelector />
			<div class="space-x-2">
				<GradientButton type="submit">Search</GradientButton>
				<GradientButton>Export to Excel</GradientButton>
			</div>
		</div>
	</form>
	<table class="w-full border-collapse">
		<thead>
			<tr>
				<th class="border">
					<DashboardCardSmallHeading>Time Stamp</DashboardCardSmallHeading>
				</th>
				<th class="border">
					<DashboardCardSmallHeading>Booking ID</DashboardCardSmallHeading>
				</th>
				<th class="border">
					<DashboardCardSmallHeading>Room ID</DashboardCardSmallHeading>
				</th>
				<th class="border">
					<DashboardCardSmallHeading>Remarks</DashboardCardSmallHeading>
				</th>
				<th class="border">
					<DashboardCardSmallHeading>User ID</DashboardCardSmallHeading>
				</th>
			</tr>
		</thead>
		<tbody>
			{#if logReportArray.length === 0}
				<tr>
					<td colspan="5" class="border px-2 text-center">No data found</td>
				</tr>
			{/if}
			{#each logReportArray as { LogID, RoomID, BookingID, Remarks, UserID, TimeStamp }}
				<tr class="text-xs">
					<td class="border px-2">{TimeStamp}</td>
					<td class="border px-2 text-center">{BookingID}</td>
					<td class="border px-2 text-center">{RoomID}</td>
					<td class="border px-2">{Remarks}</td>
					<td class="border px-2">{UserID}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
