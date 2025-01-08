<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import GradientButton from '$lib/components/ui/gradient-button.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
	import RoomStatusLegend from '$lib/components/ui/RoomStatusLegend.svelte';
	import { HoverCard, HoverCardContent, HoverCardTrigger } from '$lib/components/ui/hover-card';
    import { formatTimeWithAMPM } from '$lib/utils/date-utils';
	import { strftime } from '$lib/utils/date-utils';
	import { page } from '$app/stores';
	import { Skeleton } from '$lib/components/ui/skeleton';
	export let data;

	let { startDate, endDate } = data;
    const { monthlyRoomsViewData } = data

	let roomData = null;

	function roomDataOpenHandler(open, roomId, date) {
		if (!open) return;
		const searchParams = new URLSearchParams();
		searchParams.set('roomId', roomId);
		searchParams.set('date', strftime('%F', date));

		roomData = fetch(`${$page.url.origin}/api/room-details?${searchParams}`).then((res) => res.json());
	}
</script>

<div class="container border px-0">
	<GradientHeader>Monthly Rooms View</GradientHeader>
	<div class="flex mx-4 my-4">
		<form
			class="flex items-center gap-5"
			action="/dashboard/monthly-rooms-view"
			data-sveltekit-reload
		>
			<DateRangeSelector bind:startDate bind:endDate />
			<GradientButton class="text-sm">Search</GradientButton>
		</form>
	</div>
</div>

<div class="container px-0 mt-2">
	<table class="w-full border-collapse text-xs">
		<thead>
			<tr>
				<th class="border border-black"></th>
				{#each monthlyRoomsViewData[0].data as { roomId }}
					<th class="font-normal border border-black p-0">{roomId}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each monthlyRoomsViewData as dailyRoomData}
				<tr class="hover:bg-gray-300 transition-colors ">
					<td class="border border-black whitespace-nowrap pr-2"
						>{@html strftime('%d-%b-%Y <br/> %A', dailyRoomData.date)}
					</td>
					{#each Object.values(dailyRoomData.data) as { status, iconUrl, color, roomId }}
						<td class={`border border-black p-1 ${color}`}>
							{#if status != 'empty'}
								<HoverCard
									onOpenChange={(open) => roomDataOpenHandler(open, roomId, dailyRoomData.date)}
									openDelay={500}
									closeDelay={500}
								>
									<HoverCardTrigger>
										<img
											src={iconUrl}
											class="w-8 hover:scale-150 transition-transform"
											alt={status}
											loading="lazy"
										/>
									</HoverCardTrigger>
									<HoverCardContent class={`${color} p-4 min-w-[300px]`}>
										{#await roomData}
											<Skeleton class="bg-black/10 p-5 text-white backdrop-blur-sm backdrop-opacity-70 w-full h-24" />
                                            <hr class="border-black my-2"/>
											<Skeleton class="bg-black/10 p-5 text-white backdrop-blur-sm backdrop-opacity-70 w-full h-24" />
										{:then roomDetails}
                                        <div class="space-y-2">
                                            <h3 class="font-bold text-lg">Room ID: {roomDetails.RoomID}</h3>
                                            <div class="text-sm space-y-1">
                                                <div>
                                                    <p>
                                                        <span class="font-semibold">Booking ID:</span>
                                                        <span>{roomDetails.BookingID}</span>
                                                    </p>
                                                    {#if roomDetails?.RoomType}
                                                        <p>
                                                            <span class="font-semibold">Room Type:</span>
                                                            {roomDetails.RoomType}
                                                        </p>
                                                    {/if}
                                                    <p><span class="font-semibold">Status:</span> {roomDetails.Status}</p>

                                                    <div class="border-t border-black pt-1 mt-2">
                                                        <table class="w-full">
                                                            <tr>
                                                                <td class="font-semibold pr-2">From:</td>
                                                                <td
                                                                    >{strftime(`%d-%b-%Y`, new Date(roomDetails.StartDate))} ({roomDetails.ETA}) - {strftime(`%A`, roomDetails
                                                                        .StartDate)}
                                                                        </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="font-semibold pr-2">To:</td>
                                                                <td
                                                                    >{strftime(`%d-%b-%Y`, new Date(roomDetails.EndDate))} ({roomDetails.ExpectedCheckOut}) - {strftime(`%A`, new Date(roomDetails
                                                                        .EndDate))}</td
                                                                >
                                                            </tr>
                                                        </table>

                                                        <div class="flex justify-between mt-2">
                                                            <div class="space-x-0.5">
                                                                <span class="font-semibold">ETA:</span>
                                                                <span>{formatTimeWithAMPM(roomDetails.ETA)}</span>
                                                            </div>
                                                            <div class="space-x-0.5">
                                                                <span class="font-semibold">ETD:</span>
                                                                <span>{formatTimeWithAMPM(roomDetails.ExpectedCheckOut)}</span>
                                                            </div>
                                                        </div>

                                                        {#if roomDetails.Status === 'Blocked'}
                                                            <p>
                                                                <span class="font-semibold">Comment:</span>
                                                                {roomDetails.Remark}
                                                            </p>
                                                        {/if}
                                                    </div>

                                                    {#if roomDetails.Status !== 'Blocked'}
                                                        <div class="border-t border-black pt-1 mt-2">
                                                            <p>
                                                                <span class="font-semibold">Guest Name:</span>
                                                                {roomDetails.Name}
                                                            </p>
                                                            <p>
                                                                <span class="font-semibold">eJamaat ID:</span>
                                                                {roomDetails.eJamaatID}
                                                            </p>
                                                            <p>
                                                                <span class="font-semibold">Number of Guests:</span>
                                                                {roomDetails.CntPerson}
                                                            </p>
                                                        </div>
                                                    {/if}

                                                    {#if roomDetails.ToiletSeat == "Y" || roomDetails.WheelChair == "Y" || roomDetails.OtherRequest != ""}
                                                        <div class="border-t pt-1 mt-2">
                                                            <p class="font-semibold">Special Requirements:</p>
                                                            {#if roomDetails.ToiletSeat == "Y"}<p>• Toilet Seat</p>{/if}
                                                            {#if roomDetails.WheelChair == "Y"}<p>• Wheel Chair</p>{/if}
                                                            {#if roomDetails.OtherRequest != ""}<p>
                                                                    • {roomDetails.OtherRequest}
                                                                </p>{/if}
                                                        </div>
                                                    {/if}
                                                </div>
                                            </div>
                                        </div>
										{/await}
									</HoverCardContent>
								</HoverCard>
							{:else}
								<img src={iconUrl} class="w-8" alt={status} loading="lazy" />
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<RoomStatusLegend />
</div>
