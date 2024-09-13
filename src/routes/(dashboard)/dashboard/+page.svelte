<script>
	import DashboardCardSmallHeading from '$lib/components/ui/dashboard/dashboard-card-small-heading.svelte';
	import DashboardCard from '$lib/components/ui/dashboard/dashboard-card.svelte';
	import RightArrowLi from '$lib/components/ui/dashboard/right-arrow-li.svelte';

	let roomStatusArray = [
		{
			date: '10-Sep',
			day: 'Tue',
			isToday: false,
			booked: '2',
			occupied: '9',
			blocked: '9',
			available: '18'
		},
		{
			date: '11-Sep',
			day: 'Wed',
			isToday: false,
			booked: '2',
			occupied: '10',
			blocked: '9',
			available: '17'
		},
		{
			date: '12-Sep',
			day: 'Thu',
			isToday: false,
			booked: '5',
			occupied: '7',
			blocked: '11',
			available: '15'
		},
		{
			date: '13-Sep',
			day: 'Fri',
			isToday: false,
			booked: '11',
			occupied: '6',
			blocked: '12',
			available: '9'
		},
		{
			date: '14-Sep',
			day: 'Sat',
			isToday: false,
			booked: '20',
			occupied: '3',
			blocked: '12',
			available: '3'
		},
		{
			date: '15-Sep',
			day: 'Sun',
			isToday: false,
			booked: '18',
			occupied: '3',
			blocked: '12',
			available: '5'
		},
		{
			date: '16-Sep',
			day: 'Mon',
			isToday: false,
			booked: '21',
			occupied: '3',
			blocked: '12',
			available: '2'
		},
		{
			date: '17-Sep',
			day: 'Tue',
			isToday: false,
			booked: '23',
			occupied: '3',
			blocked: '12',
			available: '0'
		},
		{
			date: '18-Sep',
			day: 'Wed',
			isToday: false,
			booked: '24',
			occupied: '2',
			blocked: '12',
			available: '0'
		}
	];

	let todayFreeRoomsArray = [
		804, 803, 802, 801, 704, 702, 701, 601, 504, 503, 502, 304, 302, 301, 203, 201, 104
	];

	let currentGuestListArray = [
		{
			roomId: '703',
			startDate: '10-Sep-2024',
			endDate: '14-Sep-2024',
			bookingId: 'B24-1899',
			guestList: [
				{
					name: 'Shaikh Aliasgar bhai Mulla Abbas bhai Manco',
					eJamaatID: '20324198'
				},
				{
					name: 'Mohammed bhai Shaikh Aliasgar bhai Manco',
					eJamaatID: '30361053'
				},
				{
					name: 'Sarrah bai Shaikh Aliasgar bhai Manco',
					eJamaatID: '30361054'
				},
				{
					name: 'Masuma bai Shaikh Aliasgar bhai Manco',
					eJamaatID: '30361050'
				}
			]
		},
		{
			roomId: '703',
			startDate: '10-Sep-2024',
			endDate: '14-Sep-2024',
			bookingId: 'B24-1899',
			guestList: [
				{
					name: 'Shaikh Aliasgar bhai Mulla Abbas bhai Manco',
					eJamaatID: '20324198'
				},
				{
					name: 'Mohammed bhai Shaikh Aliasgar bhai Manco',
					eJamaatID: '30361053'
				},
				{
					name: 'Sarrah bai Shaikh Aliasgar bhai Manco',
					eJamaatID: '30361054'
				},
				{
					name: 'Masuma bai Shaikh Aliasgar bhai Manco',
					eJamaatID: '30361050'
				}
			]
		}
	];

	let guestListCount = 0;
	$: {
		guestListCount = currentGuestListArray.reduce(
			(total, guestListObj) => total + guestListObj.guestList.length,
			0
		);
	}
</script>

<div class="px-4 mb-8">
	<div class="mt-2 grid grid-cols-7 text-sm gap-4">
		<ul class="text-red-900 font-semibold space-y-1 shadow-md p-2">
			<RightArrowLi>New Walk In</RightArrowLi>
			<RightArrowLi>Check In</RightArrowLi>
			<RightArrowLi class="border-b border-b-gray-500 pb-1">Check Out</RightArrowLi>
			<RightArrowLi>Advances</RightArrowLi>
			<RightArrowLi>Expenses</RightArrowLi>
			<RightArrowLi>Billing</RightArrowLi>
			<RightArrowLi class="border-b border-b-gray-500 pb-1">Payment</RightArrowLi>
			<RightArrowLi class="border-b border-b-gray-500 pb-1">Exit Scan</RightArrowLi>
			<RightArrowLi>Reports</RightArrowLi>
			<RightArrowLi>Masters</RightArrowLi>
			<RightArrowLi>Room Maintenance</RightArrowLi>
			<RightArrowLi>Booking Cancel</RightArrowLi>
			<RightArrowLi class="border-b border-b-gray-500 pb-1">Wait RightArrowList</RightArrowLi>
			<RightArrowLi class="border-b border-b-gray-500 pb-1">Log reports</RightArrowLi>
			<RightArrowLi>Messaging</RightArrowLi>
		</ul>
		<div class="col-span-2 space-y-4">
			<!-- Room Status Start -->
			<DashboardCard class="px-2 py-3">
				<div class="flex justify-between items-center">
					<h2 class="text-apsanatorium_font_blue text-lg font-semibold">Rooms Status</h2>
					<ul class="text-red-900 space-y-0.5 text-xs">
						<li><a href="/daily-room-view">Daily Rooms View</a></li>
						<li><a href="/daily-room-view">Monthly Rooms View</a></li>
					</ul>
				</div>

				<table class="mt-2">
					<thead>
						<tr class="text-blue-800 bg-blue-50">
							<th class="border border-gray-400 px-2">Date</th>
							<th class="border border-gray-400 px-2">Day</th>
							<th class="border border-gray-400 px-2">Booked</th>
							<th class="border border-gray-400 px-2">Occupied</th>
							<th class="border border-gray-400 px-2">Blocked</th>
							<th class="border border-gray-400 px-2">Available</th>
						</tr>
					</thead>
					<tbody>
						{#each roomStatusArray as { date, day, booked, occupied, blocked, available, isToday }}
							<tr class="bg-gray-50 hover:bg-gray-500 hover:text-white">
								<td class="border border-gray-400 pl-2 pr-3">{date}</td>
								<td class="border border-gray-400 pl-2 pr-3">{day}</td>
								<td class="border border-gray-400 pl-2 pr-3 text-center">{booked}</td>
								<td class="border border-gray-400 pl-2 pr-3 text-center">{occupied}</td>
								<td class="border border-gray-400 pl-2 pr-3 text-center">{blocked}</td>
								<td class="border border-gray-400 pl-2 pr-3 text-center">{available}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</DashboardCard>
			<!-- Room Status End -->

			<!-- Today's Free Rooms Start -->
			<DashboardCard class="px-1 py-1 bg-blue-50">
				<h2
					class="text-center text-lg font-extrabold bg-gradient-to-b from-blue-700 to-blue-950 text-white py-2"
				>
					Today's FREE Rooms
				</h2>
				<ul class="mt-2 flex gap-2 flex-wrap font-bold max-w-96">
					{#each todayFreeRoomsArray as roomNumber}
						<li>{roomNumber}</li>
					{/each}
					<li></li>
				</ul>
			</DashboardCard>
			<!-- Today's Free Rooms End -->

			<!-- Edit Booking Start -->
			<DashboardCard>
				<DashboardCardSmallHeading class="text-center" variant="blue">
					<h2>Edit booking</h2>
				</DashboardCardSmallHeading>

				<div class="mt-1 ml-1 flex items-center gap-2">
					<label for="bookingId font-bold">Booking ID:</label>
					<input type="text" class="rounded-md border border-blue-400" />
					<button class="text-white bg-gradient-to-b from-blue-500 to-blue-950 py-0.5 px-2 text-xs"
						>Go</button
					>
					<button class="text-white bg-gradient-to-b from-blue-500 to-blue-950 py-0.5 px-2 text-xs"
						>View</button
					>
				</div>
				<a href="/dashboard/search-ejamaat-id" class="block text-red-900 text-xs mt-2 mb-1 ml-2"
					>To search ejamaatID and name Click here</a
				>
			</DashboardCard>
			<!-- Edit Booking End -->
			<!-- Next Ejamaat ID Start -->
			<DashboardCard>
				<DashboardCardSmallHeading class="text-center" variant="blue">
					<h2>Next Ejamaat</h2>
				</DashboardCardSmallHeading>
				<p class="ml-2 mb-1"><strong>Ejamaat ID:</strong> <span>99990000</span></p>
			</DashboardCard>
			<!-- Next Ejamaat ID End -->
			<!-- Mass Mailing Start -->
			<DashboardCard>
				<DashboardCardSmallHeading class="text-center" variant="blue">
					<h2>Mass mailing</h2>
				</DashboardCardSmallHeading>
				<a href="/mass-mail" class="text-xs block ml-2 mb-1 text-red-900"
					>Click here for mass mailing</a
				>
			</DashboardCard>
			<!-- Mass Mailing End -->
			<!-- Waitlist Booking Start -->
			<DashboardCard>
				<DashboardCardSmallHeading class="text-center" variant="blue">
					<h2>Waitlist Booking</h2>
				</DashboardCardSmallHeading>
				<ul class="space-y-2 px-1 mt-2">
					<li class="flex justify-between items-center">
						<span>New waitlist created today</span><span
							class="bg-yellow-300 text-apsanatorium_font_blue text-lg px-2">1</span
						>
					</li>
					<li class="flex justify-between items-center">
						<span>Waitlist pending for next 8 to 30 days: </span><span
							class="bg-yellow-300 text-apsanatorium_font_blue text-lg px-2">1</span
						>
					</li>
					<li class="flex justify-between items-center">
						<span>Waitlist pending for next 31 to 60 days: </span><span
							class="bg-yellow-300 text-apsanatorium_font_blue text-lg px-2">1</span
						>
					</li>
					<li class="flex justify-between items-center">
						<span>Waitlist pending for next more than 60 days: </span><span
							class="bg-yellow-300 text-apsanatorium_font_blue text-lg px-2">1</span
						>
					</li>
				</ul>
				<a href="/waiting-list" class="text-red-900 text-xs ml-1">Click here for Wait List.</a>
			</DashboardCard>
			<!-- Waitlist Booking End -->
			<!-- Current Guest List Start -->
			<DashboardCard class="pb-2">
				<DashboardCardSmallHeading variant="blue">
					<h2 class="ml-2 space-x-0.5 py-2">
						<span class="block">Current Guest List</span>
						<span class="block">No. of Guest: {guestListCount}</span>
					</h2>
				</DashboardCardSmallHeading>
				{#each currentGuestListArray as { roomId, startDate, endDate, bookingId, guestList }}
					<div class="border border-black mx-2 mt-5">
						<h3 class="text-red-900 left-2 relative px-0.5">
							<span class="bg-white px-0.5 font-bold -top-2.5 absolute">
								Room ID: {roomId}
							</span>
							<span class="bg-white px-0.5 mr-4 text-sm absolute -top-2.5 right-0">
								Booking ID: {bookingId}
							</span>
						</h3>
						<h4 class="mt-5 text-xs ml-2 space-x-2">
							<span>Start Date: {startDate}</span>
							<span>End Date: {endDate}</span>
						</h4>

						<ol class="mt-1 mx-2 space-y-1 mb-2">
							{#each guestList as { name, eJamaatID }, guestIndex}
								<li class="text-sm flex justify-between border-b border-gray-500">
									<span>{guestIndex + 1}. {name}</span>
									<span>eJamaatID: {eJamaatID}</span>
								</li>
							{/each}
						</ol>
					</div>
				{/each}
			</DashboardCard>
			<!--  Current Guest List End -->
		</div>
	</div>
</div>
