<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import { HoverCard, HoverCardContent, HoverCardTrigger } from '$lib/components/ui/hover-card';
	import { roomViewIcons, getStandardRoomStatus } from '$lib/utils/room-view-icons';
	import RoomStatusLegend from '$lib/components/ui/RoomStatusLegend.svelte';
	export let data;

	let dailyRoomsViewDate = data.dailyRoomsViewDate;
	let dailyRoomsViewData = data.dailyRoomsViewData;
	const floors = dailyRoomsViewData.floors;
</script>

<div class="container border px-0">
	<GradientHeader>Daily Rooms View</GradientHeader>
	<div class="flex justify-between items-center mx-4 my-4">
		<form
			class="flex items-center gap-5"
			action="/dashboard/daily-rooms-view"
			data-sveltekit-reload
		>
			<div class="flex items-center gap-2">
				<label for="dailyRoomsViewDate">Select Date</label>
				<input
					type="date"
					id="dailyRoomsViewDate"
					name="dailyRoomsViewDate"
					bind:value={dailyRoomsViewDate}
					class="border rounded-md px-0.5"
				/>
			</div>
			<GradientButton class="text-sm">Search</GradientButton>
		</form>
		<a href="/dashboard/monthly-rooms-view" class="text-xs text-red-800"> Monthly Rooms View </a>
	</div>
</div>

<!-- Daily Rooms View Table-->
<div class="container mx-auto p-4">
	<table class="w-full border-collapse">
		<thead class="text-sm">
			<tr>
				<th class="w-16 border">Floor</th>
				<th class="border" colspan="6">Rooms</th>
			</tr>
		</thead>
		<tbody>
			{#each floors as floor}
				<tr>
					<td class="text-center text-2xl font-bold text-blue-900 border p-2">
						{floor.FloorID}
					</td>
					<td class="border p-2">
						<div class="grid grid-cols-8 gap-2">
							{#each floor.rooms as room}
								<div class="relative p-1 border border-blue-300 rounded-md">
									<div
										class={`p-3 rounded-md shadow-sm ${roomViewIcons[room.cssClass.toLowerCase()].color} h-full flex flex-col justify-between items-start`}
									>
										<div class="w-full">
											<div class="flex justify-between items-start">
												<img
													src={roomViewIcons[room.cssClass.toLowerCase()].url}
													alt={room.cssClass}
													loading="lazy"
												/>
												<div class="text-sm font-semibold">{room.RoomID}</div>
											</div>
											<div class="text-sm font-bold mt-2 mb-4">{room.BookingID}</div>
										</div>
										{#if room.cssClass === 'Empty'}
											<HoverCard openDelay={100} closeDelay={100}>
												<HoverCardTrigger
													class="text-sm text-blue-600 hover:text-blue-800 underline mt-2"
												>
													Click to Book
												</HoverCardTrigger>
												<HoverCardContent
													class="text-center text-lg text-apsanatorium_font_blue font-bold"
												>
													Free Room
												</HoverCardContent>
											</HoverCard>
										{:else}
											<HoverCard openDelay={100} closeDelay={100}>
												<HoverCardTrigger
													class="text-sm text-blue-600 hover:text-blue-800 underline mt-2"
												>
													View Details
												</HoverCardTrigger>
												<HoverCardContent
													class={`${roomViewIcons[room.cssClass.toLowerCase()].color} p-4 space-y-3 min-w-[300px]`}
												>
													<div class="space-y-2">
														<h3 class="font-bold text-lg">Room ID: {room.RoomID}</h3>
														<div class="text-sm space-y-1">
															<div>
																<p>
																	<span class="font-semibold">Booking ID:</span>
																	<span>{room.BookingID}</span>
																</p>
																{#if room.details.roomType}
																	<p>
																		<span class="font-semibold">Room Type:</span>
																		{room.details.roomType}
																	</p>
																{/if}
																<p><span class="font-semibold">Status:</span> {room.Status}</p>

																<div class="border-t border-black pt-1 mt-2">
																	<table class="w-full">
																		<tr>
																			<td class="font-semibold pr-2">From:</td>
																			<td
																				>{room.details.dates.start} ({room.details.eta}) - {room
																					.details.dates.startDay}</td
																			>
																		</tr>
																		<tr>
																			<td class="font-semibold pr-2">To:</td>
																			<td
																				>{room.details.dates.end} ({room.details.etd}) - {room
																					.details.dates.endDay}</td
																			>
																		</tr>
																	</table>

																	<div class="flex justify-between mt-2">
																		<div class="space-x-0.5">
																			<span class="font-semibold">ETA:</span>
																			<span>{room.details.eta}</span>
																		</div>
																		<div class="space-x-0.5">
																			<span class="font-semibold">ETD:</span>
																			<span>{room.details.etd}</span>
																		</div>
																	</div>

																	{#if room.Status === 'Blocked'}
																		<p>
																			<span class="font-semibold">Comment:</span>
																			{room.details.remark}
																		</p>
																	{/if}
																</div>

																{#if room.Status !== 'Blocked'}
																	<div class="border-t border-black pt-1 mt-2">
																		<p>
																			<span class="font-semibold">Guest Name:</span>
																			{room.details.guest.name}
																		</p>
																		<p>
																			<span class="font-semibold">eJamaat ID:</span>
																			{room.details.guest.eJamaatID}
																		</p>
																		<p>
																			<span class="font-semibold">Number of Guests:</span>
																			{room.details.guest.count}
																		</p>
																	</div>
																{/if}

																{#if room.details.amenities.toiletSeat || room.details.amenities.wheelChair || room.details.amenities.otherRequests}
																	<div class="border-t pt-1 mt-2">
																		<p class="font-semibold">Special Requirements:</p>
																		{#if room.details.amenities.toiletSeat}<p>• Toilet Seat</p>{/if}
																		{#if room.details.amenities.wheelChair}<p>• Wheel Chair</p>{/if}
																		{#if room.details.amenities.otherRequests}<p>
																				• {room.details.amenities.otherRequests}
																			</p>{/if}
																	</div>
																{/if}
															</div>
														</div>
													</div>
												</HoverCardContent>
											</HoverCard>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- Legend -->
	<RoomStatusLegend />
</div>
