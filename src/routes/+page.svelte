<script>
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Card from '$lib/components/ui/card';
	import { CalendarCheck2 } from 'lucide-svelte';

	let images = [
		'/images/carousel/img1.jpg',
		'/images/carousel/img2.jpg',
		'/images/carousel/img3.jpg',
		'/images/carousel/img4.jpg'
	];

	let announcements = [
		`Contact us on Office Mobile Number +919833802410 (Whatsapp) Office no. +91 22 23814427 between 10am & 5pm Indian Standard Time. Monday to Saturday`,
		`This is to inform you that ONLINE BOOKING server is under maintenance. In case you may contact us on +91-9833802410 (Whatsapp / Calling).`
	];
</script>

<Carousel.Root
	opts={{
		loop: true
	}}
>
	<Carousel.Content>
		{#each images as carousel_image}
			<Carousel.Item class="pl-0">
				<img src={carousel_image} alt="" />
			</Carousel.Item>
		{/each}
	</Carousel.Content>
</Carousel.Root>

<h1 class="text-center font-cursive text-4xl mt-5 lg:text-6xl">
	Welcome to Sir A P Sanatorium Trust
</h1>

<div class="card-container mt-20 md:mt-10 container md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
	<Card.Root class="mt-20 border-gray-500 bg-gradient-to-b from-white to-gray-200">
		<Card.Header>
			<Card.Title>
				<div class="-mt-20">
					<div class="relative">
						<svg
							width="100%"
							height="122"
							viewBox="0 0 258 122"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M69.7348 9.49676L69.7323 9.49657C67.5106 9.31936 65.693 9.23631 63.9971 9.23631C58.2148 9.23631 53.9306 10.2249 50.7532 12.1222L50.7514 12.1232C45.4518 15.2779 41.8312 21.0721 41.4317 26.7218L41.3332 28.116H39.9355H38.9688C33.6856 28.116 29.0126 31.4053 26.6539 37.0157L26.2677 37.9344H25.2711H18.3238C13.5453 37.9344 9.2734 39.3011 6.23574 41.4327C3.19282 43.568 1.5 46.3722 1.5 49.2953V72.7029C1.5 75.6255 3.19272 78.4293 6.23564 80.5642C9.27329 82.6954 13.5453 84.0618 18.3238 84.0618H25.2711H26.2682L26.6542 84.9811C29.0108 90.5941 33.6846 93.884 38.9688 93.884H39.9355H41.3332L41.4317 95.2782C41.8312 100.929 45.4517 106.722 50.7517 109.878L50.7523 109.879C53.9304 111.773 58.2153 112.764 63.9971 112.764C65.6927 112.764 67.5118 112.682 69.7326 112.507C74.2308 112.151 79.132 111.284 84.4214 110.348L84.5032 110.334L84.5036 110.334L84.5906 110.318C91.814 109.038 99.4464 107.685 106.396 107.685C116.898 107.685 124.079 110.913 128.425 118.132L129.004 119.093L129.583 118.132C133.928 110.913 141.108 107.685 151.606 107.685C158.558 107.685 166.186 109.037 173.406 110.317L173.499 110.334L173.499 110.334L173.553 110.343C178.853 111.281 183.767 112.151 188.27 112.505L188.272 112.505C190.495 112.682 192.313 112.764 194.009 112.764C199.788 112.764 204.07 111.774 207.253 109.878C212.555 106.718 216.174 100.927 216.573 95.2783L216.671 93.884H218.069H219.038C224.322 93.884 228.993 90.5944 231.352 84.9808L231.738 84.0618H232.735H239.677C244.458 84.0618 248.729 82.6953 251.766 80.5643C254.808 78.4296 256.5 75.6259 256.5 72.7029V49.2953C256.5 46.3719 254.808 43.5677 251.766 41.4326C248.729 39.3012 244.458 37.9344 239.677 37.9344H232.732H231.735L231.349 37.0151C228.993 31.4054 224.32 28.116 219.038 28.116H218.069H216.671L216.573 26.7217C216.174 21.0723 212.555 15.2811 207.253 12.123L207.252 12.1226C204.07 10.2247 199.788 9.23631 194.009 9.23631C192.313 9.23631 190.495 9.31937 188.277 9.49468L188.276 9.49474C183.752 9.8499 178.819 10.7224 173.498 11.6637C173.498 11.6637 173.498 11.6638 173.498 11.6638L173.4 11.6812C166.181 12.9615 158.555 14.314 151.606 14.314C141.108 14.314 133.928 11.0851 129.583 3.86983L129.583 3.86963L129.004 2.90837L128.425 3.86964L128.425 3.86997C124.079 11.0852 116.898 14.314 106.4 14.314C99.449 14.314 91.822 12.9612 84.603 11.6807L84.5076 11.6638L84.5069 11.6637L84.4796 11.6589C79.1668 10.7194 74.2468 9.84933 69.7348 9.49676Z"
								fill="#010171"
								stroke="white"
								stroke-width="3"
							/>
						</svg>
						<h2 class="absolute inset-1/2 text-white -translate-x-1/2 -translate-y-1/2 w-fit h-fit">
							Announcements
						</h2>
					</div>
				</div>
			</Card.Title>
			<!-- <Card.Description>Card Description</Card.Description> -->
		</Card.Header>
		<Card.Content>
			<div class="w-full">
				<Carousel.Root
					opts={{
						loop: true
					}}
				>
					<Carousel.Content>
						{#each announcements as announcement}
							<Carousel.Item class="pl-4">
								<p class="text-sm text-center">{announcement}</p>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
				</Carousel.Root>
			</div>
		</Card.Content>
		<!-- <Card.Footer>
      <p>Card Footer</p>
    </Card.Footer> -->
	</Card.Root>

	<Card.Root class="mt-20 border-gray-500 bg-gradient-to-b from-white to-blue-200">
		<Card.Header>
			<Card.Title>
				<div class="relative">
					<div
						class="z-10 relative bg-apsanatorium_blue p-5 inline-block rounded-full border-white border-4"
					>
						<CalendarCheck2 size="60" color="white" />
					</div>
					<div
						class="bg-red-700 text-white py-4 px-8 inline-flex justify-center items-center rounded-md -ml-4 z-0 absolute top-1/2 -translate-y-1/2"
					>
						<p class="uppercase text-2xl">book online</p>
					</div>
				</div>
			</Card.Title>
			<!-- <Card.Description>Card Description</Card.Description> -->
		</Card.Header>
		<Card.Content>
			<p class="text-center font-bold">Sir Adamji Peerbhoy Sanatorium Trust</p>
			<p class="text-center">
				15/17 Maharshi Karve Marg, Next to Saifee Hospital Mumbai 400 004 India.
			</p>
		</Card.Content>
		<!-- <Card.Footer>
      <p>Card Footer</p>
    </Card.Footer> -->
	</Card.Root>

	<Card.Root class="mt-20 border-gray-500 bg-gradient-to-b from-white to-gray-200">
		<Card.Header>
			<Card.Title>
				<div class="-mt-20">
					<div class="relative">
						<svg
							width="100%"
							height="122"
							viewBox="0 0 258 122"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M69.7348 9.49676L69.7323 9.49657C67.5106 9.31936 65.693 9.23631 63.9971 9.23631C58.2148 9.23631 53.9306 10.2249 50.7532 12.1222L50.7514 12.1232C45.4518 15.2779 41.8312 21.0721 41.4317 26.7218L41.3332 28.116H39.9355H38.9688C33.6856 28.116 29.0126 31.4053 26.6539 37.0157L26.2677 37.9344H25.2711H18.3238C13.5453 37.9344 9.2734 39.3011 6.23574 41.4327C3.19282 43.568 1.5 46.3722 1.5 49.2953V72.7029C1.5 75.6255 3.19272 78.4293 6.23564 80.5642C9.27329 82.6954 13.5453 84.0618 18.3238 84.0618H25.2711H26.2682L26.6542 84.9811C29.0108 90.5941 33.6846 93.884 38.9688 93.884H39.9355H41.3332L41.4317 95.2782C41.8312 100.929 45.4517 106.722 50.7517 109.878L50.7523 109.879C53.9304 111.773 58.2153 112.764 63.9971 112.764C65.6927 112.764 67.5118 112.682 69.7326 112.507C74.2308 112.151 79.132 111.284 84.4214 110.348L84.5032 110.334L84.5036 110.334L84.5906 110.318C91.814 109.038 99.4464 107.685 106.396 107.685C116.898 107.685 124.079 110.913 128.425 118.132L129.004 119.093L129.583 118.132C133.928 110.913 141.108 107.685 151.606 107.685C158.558 107.685 166.186 109.037 173.406 110.317L173.499 110.334L173.499 110.334L173.553 110.343C178.853 111.281 183.767 112.151 188.27 112.505L188.272 112.505C190.495 112.682 192.313 112.764 194.009 112.764C199.788 112.764 204.07 111.774 207.253 109.878C212.555 106.718 216.174 100.927 216.573 95.2783L216.671 93.884H218.069H219.038C224.322 93.884 228.993 90.5944 231.352 84.9808L231.738 84.0618H232.735H239.677C244.458 84.0618 248.729 82.6953 251.766 80.5643C254.808 78.4296 256.5 75.6259 256.5 72.7029V49.2953C256.5 46.3719 254.808 43.5677 251.766 41.4326C248.729 39.3012 244.458 37.9344 239.677 37.9344H232.732H231.735L231.349 37.0151C228.993 31.4054 224.32 28.116 219.038 28.116H218.069H216.671L216.573 26.7217C216.174 21.0723 212.555 15.2811 207.253 12.123L207.252 12.1226C204.07 10.2247 199.788 9.23631 194.009 9.23631C192.313 9.23631 190.495 9.31937 188.277 9.49468L188.276 9.49474C183.752 9.8499 178.819 10.7224 173.498 11.6637C173.498 11.6637 173.498 11.6638 173.498 11.6638L173.4 11.6812C166.181 12.9615 158.555 14.314 151.606 14.314C141.108 14.314 133.928 11.0851 129.583 3.86983L129.583 3.86963L129.004 2.90837L128.425 3.86964L128.425 3.86997C124.079 11.0852 116.898 14.314 106.4 14.314C99.449 14.314 91.822 12.9612 84.603 11.6807L84.5076 11.6638L84.5069 11.6637L84.4796 11.6589C79.1668 10.7194 74.2468 9.84933 69.7348 9.49676Z"
								fill="#010171"
								stroke="white"
								stroke-width="3"
							/>
						</svg>
						<h2 class="absolute inset-1/2 text-white -translate-x-1/2 -translate-y-1/2 w-fit h-fit">
							Location
						</h2>
					</div>
				</div>
			</Card.Title>
			<!-- <Card.Description>Card Description</Card.Description> -->
		</Card.Header>
		<Card.Content>
			<p class="text-center font-bold">Sir Adamji Peerbhoy Sanatorium Trust</p>
			<p class="text-center">
				15/17 Maharshi Karve Marg, Next to Saifee Hospital Mumbai 400 004 India.
			</p>
		</Card.Content>
		<!-- <Card.Footer>
      <p>Card Footer</p>
    </Card.Footer> -->
	</Card.Root>
</div>
