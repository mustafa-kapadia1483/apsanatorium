<script>
	import Pagecontainer from '../../components/pagecontainer.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	let overviewCards = [
		{
			title: 'Mumbai - The Business Capital of India',
			content:
				"Mumbai, which was previously known as Bombay is a major metropolitan city of India. It is the state capital of Maharashtra. Mumbai city is known as the business capital of India, it being the country's principal financial and communications centre.<br/><br/>The city has the largest and the busiest port handling India's foreign trade and a major International airport. India's largest Stock Exchange which ranks as the third largest in the world, is situated in Mumbai. Here, trading of stocks is carried out in billions of rupees everyday."
		},
		{
			title: 'Climate of Mumbai',
			content:
				"Most of the year, Mumbai's climate is warm and humid. Between November and February, the skies are clear,and the temperature is cooler. From March the temperature becomes warm and humid till mid June, the beginning of monsoon. During monsoon there are torrential rains, sometimes causing the flooding of major roads and streets of Mumbai. The average rainfall which is brought by the south-west monsoon winds in Mumbai is 180 cms. Monsoon ends by the end of September. October is comparatively hot and humid."
		},
		{
			title: 'History of Mumbai',
			content:
				'In 1661, King Charles II of England, married Princess Catherine de Braganza of Portugal, and as part of the dowry he received "Bombay" which is today known as Mumbai. Later in 1668 it was handed over to the East India Company.<br/><br/>In 1858 the administration of the country was taken over by the Queen of England, Queen Victoria, from the East India Company. A viceroy was appointed to rule India in the name of the Queen. Bombay came under the direct rule of the British in 1861.<br/><br/>The first railway line in India was started between Bombay (VT) and Thane in 1861. In 1864, modern water supply was started in Bombay (Mumbai) and in 1885, Bombay was lit with gas.<br/><br/>Mahatma Gandhi joining Indian Politics in 1920, was a turning point in the political destiny of India which led to the Independence of India from the British rule. Bombay (Mumbai) had an important role to play in this event.'
		},
		{
			title: 'Where is Mumbai?',
			content:
				'Mumbai (Bombay) lies on the western coast of India. It is a group of seven islands in the Arabian Sea which lies off the northern Konkan coast on the west of Maharashtra state in India. These seven islands which were once seperated by creeks and channels were filled and bridged over the years by the inhabitants.'
		}
	];
</script>

<Pagecontainer title="About Mumbai">
	<img src="/images/aboutmumbai_img.jpg" alt="mumbai" width="w-full" />
	<h2 class="mt-2 text-2xl ml-3">Overview</h2>
	<div class="mt-2 ml-3 grid md:grid-flow-col-dense gap-5">
		{#each overviewCards as overviewCard}
			<div>
				<h3 class="font-bold text-apsanatorium_font_blue text-lg mb-0.5">{overviewCard.title}</h3>
				<ScrollArea class="md:h-96">{@html overviewCard.content}</ScrollArea>
			</div>
		{/each}
	</div>
</Pagecontainer>
