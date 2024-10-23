<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DashboardCardSmallHeading from '$lib/components/ui/dashboard/dashboard-card-small-heading.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import { onMount } from 'svelte';
	import { applyAction, deserialize, enhance } from '$app/forms';
	export let data;

	const logReportArray = data.logReportArray || [];

	onMount(() => {
		document.getElementById('startDate').valueAsDate = new Date();
		document.getElementById('endDate').valueAsDate = new Date();
	});
</script>

<div class="container border px-0">
	<GradientHeader>Log Report</GradientHeader>
	<form class="py-4 bg-alternate_background" method="POST">
		<div class="w-3/4 mx-auto space-y-2">
			<div class="flex justify-between">
				<div>
					<label for="bookingId">Booking ID:</label>
					<input type="text" name="bookingId" id="bookingId" class="border" />
				</div>
				<div>
					<label for="keyword">Keyword:</label>
					<input type="text" name="keyword" id="keyword" class="border" />
				</div>
			</div>
			<div class="flex gap-5">
				<div>
					<label for="startDate">Date From:</label>
					<input class="border" type="date" name="startDate" id="startDate" />
				</div>
				<div>
					<label for="endDate">Date To:</label>
					<input class="border" type="date" name="endDate" id="endDate" />
				</div>
				<div class="flex gap-2 text-xs">
					<div class="flex items-center gap-1">
						<input type="radio" value="today" name="timeframe" id="today" />
						<label for="today">Today</label>
					</div>
					<div class="flex items-center gap-1">
						<input type="radio" value="this-month" name="timeframe" id="this-month" />
						<label for="this-month">This Month</label>
					</div>
					<div class="flex items-center gap-1">
						<input type="radio" value="last-month" name="timeframe" id="last-month" />
						<label for="last-month">Last Month</label>
					</div>
					<div class="flex items-center gap-1">
						<input type="radio" value="last-30-days" name="timeframe" id="last-30-days" />
						<label for="last-30-days">Last 30 Days</label>
					</div>
					<div class="flex items-center gap-1">
						<input
							type="radio"
							value="this-financial-year"
							name="timeframe"
							id="this-financial-year"
						/>
						<label for="this-financial-year">This financial year</label>
					</div>
					<div class="flex items-center gap-1">
						<input
							type="radio"
							value="last-financial-year"
							name="timeframe"
							id="last-financial-year"
						/>
						<label for="last-financial-year">Last financial year</label>
					</div>
				</div>
			</div>
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
					<DashboardCardSmallHeading>User</DashboardCardSmallHeading>
				</th>
			</tr>
		</thead>
		<tbody>
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
