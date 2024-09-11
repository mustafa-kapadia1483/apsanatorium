<script>
	import Pagecontainer from '$lib/components/pagecontainer.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	let imgSrcArray = [
		'/images/photo-gallery/1.jpg',
		'/images/photo-gallery/2.jpg',
		'/images/photo-gallery/3.jpg',
		'/images/photo-gallery/4.jpg',
		'/images/photo-gallery/5.jpg',
		'/images/photo-gallery/6.jpg',
		'/images/photo-gallery/7.jpg',
		'/images/photo-gallery/8.jpg',
		'/images/photo-gallery/9.jpg',
		'/images/photo-gallery/10.jpg',
		'/images/photo-gallery/11.jpg',
		'/images/photo-gallery/12.jpg',
		'/images/photo-gallery/13.jpg',
		'/images/photo-gallery/14.jpg',
		'/images/photo-gallery/15.jpg',
		'/images/photo-gallery/16.jpg',
		'/images/photo-gallery/17.jpg',
		'/images/photo-gallery/18.jpg',
		'/images/photo-gallery/19.jpg',
		'/images/photo-gallery/20.jpg',
		'/images/photo-gallery/21.jpg',
		'/images/photo-gallery/22.jpg',
		'/images/photo-gallery/23.jpg',
		'/images/photo-gallery/24.jpg'
	];
</script>

<Pagecontainer title="Photo Gallery">
	<div class="mt-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 px-2">
		{#each imgSrcArray as imgSrc}
			<div>
				<Dialog.Root>
					<Dialog.Trigger><img src={imgSrc} alt="" class="w-full" /></Dialog.Trigger>
					<Dialog.Content>
						<!-- <Dialog.Header>
							<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
							<Dialog.Description>
								This action cannot be undone. This will permanently delete your account and remove
								your data from our servers.
							</Dialog.Description>
						</Dialog.Header> -->
						<img src={imgSrc} alt="" class="w-full" />
					</Dialog.Content>
				</Dialog.Root>
			</div>
		{/each}
	</div>
</Pagecontainer>
