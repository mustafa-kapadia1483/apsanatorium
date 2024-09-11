<script>
	import Pagecontainer from '$lib/components/pagecontainer.svelte';

	let ziarats = [
		{
			name: 'Raudat Tahera',
			distance_text: '(Taxi fare from Sanatorium to Bhendi bazaar Rs. 50 approx.)',
			timings_text: 'For Gents and Ladies combined: 5 am to 11 pm'
		},
		{
			name: 'Sakina Bensaheba',
			distance_text: '(Next to Sanatorium)',
			timings_text: 'Timings : 6:00 am to 10:30 pm'
		},
		{
			name: 'Mukasir Saheb',
			distance_text: '(Taxi fare from Sanatorium to Nariyalwadi-Mustafa Bazar Rs. 100 approx.)',
			timings_text: 'Timings : 6:00 am to 10:30 pm'
		}
	];
</script>

<Pagecontainer title="Ziarats">
	<div class="px-4 mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 pb-8">
		{#each ziarats as { name, distance_text, timings_text }}
			<div>
				<h2 class="text-xl text-apsanatorium_font_blue font-bold">{name}</h2>
				<div
					class="mt-2 border border-gray-500 p-2 md:h-full grid justify-between bg-gradient-to-b from-white to-gray-200"
				>
					<p class="text-sm">{distance_text}</p>
					<p class="text-apsanatorium_font_blue text-lg">{timings_text}</p>
				</div>
			</div>
		{/each}
	</div>
</Pagecontainer>
