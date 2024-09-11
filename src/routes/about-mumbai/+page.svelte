<script>
	import Pagecontainer from '$lib/components/pagecontainer.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Bus, TrainFront, CarTaxiFront } from 'lucide-svelte';

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

	let sightSeeingCards = [
		{
			img: 'https://apsanatorium.com/images/gatewayofindia.jpg',
			title: 'Gateway Of India',
			content:
				"Mumbai's most famous landmark, The Gateway of India, is situated at Apollo Bunder. It was designed by George Wikket. It was built to commemorate the visit of King George V and Queen Mary to India in 1911.\n                    <br>\n                    <br>\n                    Through this magnificent monument, numerous viceroys and governors were welcomed to India as they disembarked from their steamers, hence the name."
		},
		{
			img: 'https://apsanatorium.com/images/FloraFountain.jpg',
			title: 'Flora Fountain(Hutatma Chowk)',
			content:
				'This marvellous fountain was built in 1869, in honor of Sir Henry Bartle and Edward Frere. It is situated in the heart of the Mumbai city at a junction of five streets. The fountain has a figure of "Flora", the Roman Goddess of Flowers at the top.'
		},
		{
			img: 'https://apsanatorium.com/images/JuhuBeach.jpg',
			title: 'Chowpatty Beach & Juhu Beach',
			content:
				'Chowpatty beach is situated on Marine Drive. This beach is well-known for it\'s stalls selling "Bhel-Puri and Pani-Puri chat" a favourite fast food among the Mumbaites and visitors to the city.<br>\n                    <br>\n                    Juhu Beach is the most popular beach in Mumbai which is 30 kms away from the heart of Mumbai. It is a long stretch of sandy beach from Santacruz to Vile-Parle. This is a very popular beach for picnic.<br>\n                    Both these beaches are crowded on week-ends.'
		},
		{
			img: 'https://apsanatorium.com/images/KamalaNehruPark.jpg',
			title: 'Kamala Nehru Park & Hanging Gardens',
			content:
				'The giant Old woman\'s shoe in the Kamala Nehru Park is very popular with children to play in. One gets a panoramic view of parts of the city from these parks situated at the height of Malabar Hill. When seen at night, the view of street lights of Marine Drive resemble a dazzling bejewelled "Queen\'s Necklace".<br>\n                    <br>\n                    At sunset, the waterfall and fountains in the park are lit with colorful lights which are worth seeing. The Hanging Gardens surrounded by beautiful flower beds and lush green lawns are very popular as picnic spots.'
		},
		{
			img: 'https://apsanatorium.com/images/nehruplanetarium.jpg',
			title: 'Nehru Planetarium and Science Centre',
			content:
				"This Science Centre is named after Pandit Jawaharlal Nehru, India's first Prime-Minister. It is situated in Worli. It has a computer laboratory, mobile science exhibition units, a heritage hall, an auditorium, inflatable dome planetarium, science library and a children's science park.<br>\n                    <br>\n                    The sky-show at the planetarium is very interesting with it's narration, sound effects and slide projections which combines entertainment with education. It has a library containing a large collection of books on astronomy, astrophysics and space sciences."
		},
		{
			img: 'https://apsanatorium.com/images/princeofwalesmuseum.jpg',
			title: 'The Prince of Wales Museum',
			content:
				'This museum stands not too far from the Gateway of India. It has a priceless collection of art, sculpture, china and other antics. Carefully presereved, this mid-Victorian Gothic style building built in 1904 with beautiful gardens surrounding it, is worth visiting in Mumbai.'
		},
		{
			img: 'https://apsanatorium.com/images/TaraporewalaAquarium.jpg',
			title: 'Taraporewala Aquarium',
			content:
				"Situated on the Marine Drive, this aquarium has fish in varying shapes, sizes and colour. It's a delight for children as well as grown-ups."
		},
		{
			img: 'https://apsanatorium.com/images/veermatajeejabaiudyan.jpg',
			title: 'Victoria Gardens (Veermata Jeejabai Bhonsle Udyan)',
			content:
				'These botanical and zoological gardens have an interesting collection of flora and fauna. Apart from these, it also has a beautiful gateway, an arched architctural screen and a museum building in the Greco-Roman Style. These gardens are situated in Byculla.'
		},
		{
			img: 'https://apsanatorium.com/images/esselworld.jpg',
			title: 'Essel World - Amusement Park',
			content:
				'Essel World is located on Gorai Island. It offers over 40 exciting rides, games, and attractions. The Water Kingdom is said to be the largest of its kind in Asia. This international-style theme park and amusement centre situated close to Gorai Beach is perfect for a one-day holiday.\n                    <br>\n                    <br>\n                    Special ferries get you across to the park and the entrance fee normally takes care of a fixed number of rides, which include the standard roller coaster and adventure themes, plus a water world section where kids can literally run amok. Summer is usually crowded, but the place also offers low budget monsoon packages and special deals on weekends.'
		},
		{
			img: 'https://apsanatorium.com/images/imagica.jpg',
			title: 'Imagica',
			content:
				"A place so interesting you'd wish you were here every day. A place where   the fun begins and never ends. A place where you'd be friends with a   talking dog, dine with a lion chef and fly with an elephant.\n                    <br>\n                    <br>\n                    A place where you’d experience zero gravity, fight Mogambo, feel the thrill of exciting rides."
		}
	];

	let transportCards = [
		{
			icon: Bus,
			title: 'Public Bus Service (BEST)',
			content: `This system is run by a government organization "Bombay Electric Supply & Transport". It has a fleet of red single and double-decker buses. There are newly introduced airconditioned buses as well.`
		},
		{
			icon: TrainFront,
			title: 'Local Railway Lines',
			content: `Western Railway running between Churchgate and Virar.<br/><br/>Central Railway running between Chhatrapati Shivaji Terminus (Bombay V.T.) and Karjat.<br/><br/>Harbour Line running between Chhatrapati Shivaji Terminus (Bombay V.T.) and Mankhurd.<br/><br/>A new railway line running between Shivaji Terminus (Bombay V.T.) and New Mumbai.`
		},
		{
			icon: CarTaxiFront,
			title: 'Public Taxi / Autorickshaw',
			content: `Black and Yellow metered taxis.<br/><br/>Newly introduced Blue Airconditioned metered taxis.<br/><br/>Black and Yellow metered Autorickshaws which are not allowed in the central area of city. Which means there are no Auto-rickshaws between Colaba &amp; Mahim in the west and Colaba &amp; Sion in the east.<br>`
		}
	];
</script>

<Pagecontainer title="About Mumbai">
	<img src="/images/aboutmumbai_img.jpg" alt="mumbai" width="w-full" />
	<h2 class="mt-2 text-2xl ml-3" id="#overview">Overview</h2>
	<div class="mt-2 mx-3 grid md:grid-flow-col-dense gap-5">
		{#each overviewCards as overviewCard}
			<div>
				<h3 class="font-bold text-apsanatorium_font_blue text-lg mb-0.5">{overviewCard.title}</h3>
				<ScrollArea class="md:h-96">{@html overviewCard.content}</ScrollArea>
			</div>
		{/each}
	</div>

	<div class="mt-16 mx-3">
		<h2 class="mt-2 text-2xl" id="#sight-seeing">Sight Seeing</h2>
		<div class="grid md:grid-cols-2 gap-10 gap-x-20 mt-3">
			{#each sightSeeingCards as { img, title, content }}
				<div class="md:grid md:grid-cols-2 md:gap-4">
					<img src={img} alt={title} class="w-full" />
					<div>
						<h4 class="text-lg text-apsanatorium_font_blue font-bold mt-3 sm:mt-0">
							{title}
						</h4>
						<p class="text-sm mt-2">{@html content}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="mt-16 mx-3">
		<h2 class="mt-2 text-2xl" id="transport">Transport</h2>

		<div class="mt-4 grid gap-8 md:grid-cols-3">
			{#each transportCards as { icon, title, content }}
				<div>
					<div class="text-apsanatorium_font_blue flex gap-2 items-center">
						<div><svelte:component this={icon} size={40}></svelte:component></div>
						<h4 class="font-bold text-lg">{title}</h4>
					</div>
					<p class="text-sm mt-2">{@html content}</p>
				</div>
			{/each}
		</div>
	</div>
</Pagecontainer>

<!-- <svelte:component this={test.component} title="test"></svelte:component> -->
