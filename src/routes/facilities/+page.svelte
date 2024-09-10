<script>
	import { AirVent, ShowerHead, Refrigerator, Tv, Sofa, LampDesk } from 'lucide-svelte';
	import Wardrobe from '$lib/components/icons/wardrobe.svelte';
	import PageCointainer from '../../components/pagecontainer.svelte';

	let generalFacilities = [
		{
			text: 'Waiting Lounge',
			img: '/images/general_facilities/waintinglounge.jpg'
		},
		{
			text: 'Help Desk',
			img: '/images/general_facilities/helpdesk.jpg'
		},
		{
			text: '<strong>Foot massager</strong> in the reception for relaxation',
			img: '/images/general_facilities/footmassager.jpg'
		}
	];

	let generalFacilitiesBulletPoints = [
		'♦ Breakfast served between 7.30 am to 10.30 am',
		'♦ Lunch served from faiz al mawaid al burhaniyah between 12.30 pm to 2.30 pm',
		'♦ Sunday lunch not available.',
		'♦ At dawoodi masjid when there is jaman after majlis those days lunch not served and jaman izzan to all our guests'
	];
</script>

<PageCointainer title="Facilities">
	<div class="container md:grid md:grid-cols-3">
		<div class="ml-2">
			<h2 class="text-2xl mt-5 mb-5">Room Facilities</h2>
			<ul class="list-none flex flex-col gap-2 pb-3">
				<li class="flex items-center gap-2">
					<div class="bg-gray-100 rounded-lg px-2 py-1">
						<AirVent class="text-apsanatorium_blue" size="42" />
					</div>
					<span>Central Air Conditioning</span>
				</li>
				<li class="flex items-center gap-2">
					<div class="bg-gray-100 rounded-lg px-2 py-1">
						<ShowerHead class="text-apsanatorium_blue" size="42" />
					</div>
					<span>Attached Toilet/Bathroom</span>
				</li>
				<li class="flex items-center gap-2">
					<div class="bg-gray-100 rounded-lg px-2 py-1">
						<Refrigerator class="text-apsanatorium_blue" size="42" />
					</div>
					<span>Pantry with Fridge</span>
				</li>
				<li class="flex items-center gap-2">
					<div class="bg-gray-100 rounded-lg px-2 py-1">
						<Wardrobe class="text-apsanatorium_blue" size="42" />
					</div>
					<span>Wardrobe</span>
				</li>
				<li class="flex items-center gap-2">
					<div class="bg-gray-100 rounded-lg px-2 py-1">
						<LampDesk class="text-apsanatorium_blue" size="42" />
					</div>
					<span>Writing Desk</span>
				</li>
				<li class="flex items-center gap-2">
					<div class="bg-gray-100 rounded-lg px-2 py-1">
						<Tv class="text-apsanatorium_blue" size="42" />
					</div>
					<span>Television</span>
				</li>
				<li class="flex items-center gap-2">
					<div class="bg-gray-100 rounded-lg px-2 py-1">
						<Sofa class="text-apsanatorium_blue" size="42" />
					</div>
					<span>Lounge Sofas</span>
				</li>
			</ul>
		</div>
		<div class="ml-2 md:col-span-2">
			<h2 class="text-2xl mt-5 mb-5">General Facilities</h2>
			<div class="grid sm:grid-cols-3 sm:gap-x-2 gap-y-4">
				{#each generalFacilities as { text, img }}
					<div>
						<img src={img} alt="facility" />
						<p class="mt-1.5 text-center text-sm">{@html text}</p>
					</div>
				{/each}
			</div>

			<ul class="list-none text-apsanatorium_blue mt-5 space-y-1.5">
				{#each generalFacilitiesBulletPoints as point}
					<li>{@html point}</li>
				{/each}
			</ul>
		</div>
	</div>
</PageCointainer>
