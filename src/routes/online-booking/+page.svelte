<script>
	import Pagecontainer from '$lib/components/pagecontainer.svelte';

	let roomRatesArray = [
		{
			roomType: 'Sea Facing Twin Sharing (Lower Floor)',
			baseRent: 'Rs. 4200.00',
			perExtraGuestRent: 'Rs. 800.00'
		},
		{
			roomType: 'Non Sea Facing Twin Sharing (Lower Floor)',
			baseRent: 'Rs. 3700.00',
			perExtraGuestRent: 'Rs. 800.00'
		},
		{
			roomType: 'Sea Facing Double Bed (Lower Floor)',
			baseRent: 'Rs. 4200.00',
			perExtraGuestRent: 'Rs. 800.00'
		},
		{
			roomType: 'Non Sea Facing Double Bed (Lower Floor)',
			baseRent: 'Rs. 3700.00',
			perExtraGuestRent: 'Rs. 800.00'
		},
		{
			roomType: 'Sea Facing Twin Sharing (Upper floor)',
			baseRent: 'Rs. 4900.00',
			perExtraGuestRent: 'Rs. 800.00'
		},
		{
			roomType: 'Non Sea Facing Twin Sharing (Upper floor)',
			baseRent: 'Rs. 4400.00',
			perExtraGuestRent: 'Rs. 800.00'
		},
		{
			roomType: 'Sea Facing Double Bed (Upper floor)',
			baseRent: 'Rs. 4900.00',
			perExtraGuestRent: 'Rs. 800.00'
		},
		{
			roomType: 'Non Sea Facing Double Bed (Upper floor)',
			baseRent: 'Rs. 4400.00',
			perExtraGuestRent: 'Rs. 800.00'
		},
		{
			roomType: 'Sea Facing Twin Sharing (Premium Rooms)',
			baseRent: 'Rs. 6000.00',
			perExtraGuestRent: 'Rs. 1000.00'
		},
		{
			roomType: 'Non Sea Facing Twin Sharing (Premium Rooms)',
			baseRent: 'Rs. 5300.00',
			perExtraGuestRent: 'Rs. 1000.00'
		},
		{
			roomType: 'Sea Facing Double Bed (Premium Rooms)',
			baseRent: 'Rs. 6000.00',
			perExtraGuestRent: 'Rs. 1000.00'
		},
		{
			roomType: 'Non Sea Facing Double Bed (Premium Rooms)',
			baseRent: 'Rs. 5300.00',
			perExtraGuestRent: 'Rs. 1000.00'
		},
		{
			roomType: 'Sea Facing - (First Floor SOFACUMBED) 101',
			baseRent: 'Rs. 3300.00',
			perExtraGuestRent: 'Rs. 700.00'
		},
		{
			roomType: 'Sea Facing Double Bed - (First Floor 102)',
			baseRent: 'Rs. 3700.00',
			perExtraGuestRent: 'Rs. 800.00'
		},
		{
			roomType: 'Non Sea Facing - (First Floor 103 Double Bed)',
			baseRent: 'Rs. 3300.00',
			perExtraGuestRent: 'Rs. 700.00'
		},
		{
			roomType: 'Side Single Occupancy Room',
			baseRent: 'Rs. 800.00',
			perExtraGuestRent: 'Rs. 0.00'
		},
		{
			roomType: 'Non Sea Facing Twin Sharing - First Floor 104',
			baseRent: 'Rs. 3700.00',
			perExtraGuestRent: 'Rs. 800.00'
		},
		{
			roomType:
				'103-A (First Floor - A/C Room with Bed and wash basin. Bathroom facility available on Ground Floor)',
			baseRent: 'Rs. 1800.00',
			perExtraGuestRent: 'Rs. 500.00'
		},
		{
			roomType:
				'102-A (First Floor -A/C Room with Mattress and wash basin. Bathroom facility available on Ground Floor)',
			baseRent: 'Rs. 1800.00',
			perExtraGuestRent: 'Rs. 500.00'
		}
	];
</script>

<Pagecontainer title="Online Booking">
	<div class="px-4 md:grid md:grid-cols-2 md:gap-16">
		<div>
			<div>
				<h2 class="text-xl text-apsanatorium_font_blue font-bold mt-4">How to do Online Booking</h2>
				<ul class="mt-2 space-y-2">
					<li>♦ Type-in your Ejamaat number and password and click on login Button</li>
					<li>
						♦ Select your arrival date and days of stay, also select arrival time and click on
						Check Button
					</li>
					<li>
						♦ Online booking can be done prior to 2 days to date of arrival, and up to 2 months,
						before date of arrival.
					</li>
				</ul>
			</div>

			<div>
				<h2 class="text-xl text-apsanatorium_font_blue font-bold mt-4">Terms and Conditions</h2>
				<ul class="mt-2 space-y-2">
					<li>
						♦ 2 Guest(s) allowed per room with 2 extra guests. If these two extra guests are
						children below 6 years, they will be allowed free.
					</li>
					<li>
						♦ Check-in time is strictly 11.00am and Check-out time is strictly 10am. In case you
						check-in earlier than 11.00am, you will be charged an extra day.
					</li>
					<li>
						♦ Mandatory information should be filled in, without which the booking cannot be
						processed.
					</li>
					<li>
						♦ Please DO NOT share any Credit/Debit card details and OTP sms with any person in any
						form.
					</li>
					<li>
						♦ If any DAMAGES in room have been found during Check Out , extra charges will be added
						in your bill.
					</li>
					<li>
						♦ Kindly note that breakfast is not included on the day of check in. For guests
						arriving before check in time and wanting to avail of breakfast, a cost of Rs. 200/- per
						person will be added to the bill.
					</li>
					<li>♦ FMB lunch is complimentary only for in-house guests.</li>
					<li>
						♦ Personal iron brought by the guests cannot be used in the room. Please use the
						ironing facilities provided at the sanatorium.
					</li>
				</ul>
			</div>

			<div>
				<h2 class="text-xl text-apsanatorium_font_blue font-bold mt-4">Zafaf Room Booking</h2>
				<ul class="mt-2 space-y-2">
					<li>♦ Type-in your Ejamaat number and password and click on login Button</li>
					<li>♦ Click on the Zafaf/Wedding Room Booking button</li>
					<li>♦ Fill in the Online Form displayed</li>
					<li>
						♦ Once the details filled by you have been verified by our office, we will contact you
						for the payment details.
					</li>
				</ul>
			</div>

			<div>
				<h2 class="text-xl text-apsanatorium_font_blue font-bold mt-4">
					Rent Policy Effective from 1st April 2011
				</h2>
				<strong>Room confirmation policy:</strong>
				<p>
					To retain the validity of your room booking dates, we should receive the Advance Rent
					Amount on or before the dates emailed at the time of booking.
				</p>
				<strong>Advance rent policy:</strong>
				<p>
					Advance for room booking is 1 day charge for that particular room per day multiplied by
					the number of days of stay. If Advance amount is not received on or before the date
					intimated by Email, booking will be cancelled automatically, and informed by Email.
				</p>
			</div>
			<div>
				<h2 class="text-xl text-apsanatorium_font_blue font-bold mt-4">
					Refund And Cancellation Of Advance Rent Policy:
				</h2>
				<strong>Cancellation request or change of dates should be given by email.</strong>
				<ul class="mt-2 space-y-2">
					<li>
						♦ If intimation to cancel is given 8 days before arrival date, then full refund of
						advance rent amount will be refunded.
					</li>
					<li>
						♦ If intimation to cancel is given 6 days before arrival date, then 25% of advance rent
						amount will be forfeited.
					</li>
					<li>
						♦ If intimation to cancel is given 4 days before arrival date, then 50% of advance rent
						amount will be forfeited.
					</li>
					<li>
						♦ If intimation to cancel is given 3 days before arrival date, then 75% of advance rent
						amount will be forfeited.
					</li>
					<li>
						♦ If intimation to cancel is given in less than 24 hrs of arrival then full advance
						amount will be forfeited.
					</li>
					<li>
						♦ If you arrive after your booked date, and have intimated, then too, the rent charges
						of previous day’s room booked will be charged.
					</li>
					<li>♦ Extra person will be charged per night as per rate plan.</li>
					<li>♦ More than 4 persons will not be allowed in a room.</li>
				</ul>
			</div>
		</div>
		<div>
			<h2 class="text-xl text-apsanatorium_font_blue font-bold mt-4">
				Room Rates are as given below
			</h2>
			<table class="mt-4 w-full text-sm">
				<caption class="caption-bottom mt-2">
					<strong>Note:</strong> 12% GST will be charged on per room booking. For billing of more than
					Rs. 7500/- per day per room GST of 18% will be charged.
				</caption>
				<thead class="bg-apsanatorium_blue text-white">
					<tr>
						<th class="border-r border-r-gray-300 w-36 sm:w-52 px-2 py-1">Room Type</th>
						<th class="border-r border-r-gray-300 px-2 py-1">Basic Rent for 2 guests</th>
						<th class="border-r border-r-gray-300 px-2 py-1"
							>Rent for each extra guest (upto 2 guests)</th
						>
					</tr>
				</thead>
				<tbody>
					{#each roomRatesArray as { roomType, baseRent, perExtraGuestRent }, i}
						<tr class="odd:bg-blue-100">
							<td class="px-2 py-1 border border-gray-300">{roomType}</td>
							<td class="px-2 py-1 border border-gray-300">{baseRent}</td>
							<td class="px-2 py-1 border border-gray-300">{perExtraGuestRent}</td>
						</tr>
					{/each}
				</tbody>
			</table>

			<h2 class="mt-5 text-lg text-apsanatorium_font_blue">Bank Details for NEFT</h2>
			<strong class="mt-2 block">HDFC Bank Ltd. </strong>
			<span class="mt-1 block">Account No.: 03567620000018</span>
			<span class="mt-1 block">Branch: Charni Road</span>
			<span class="mt-1 block">IFSC Code: HDFC0000356</span>
			<p class="mt-4">
				<strong>Note:</strong> This is for those who have done or will be doing online booking for miqaat.
				Foreigners should pay atleast 50% of the total room rent Indian residents should do full payment
				of their room rent as per management decision.
			</p>
		</div>
	</div>
</Pagecontainer>
