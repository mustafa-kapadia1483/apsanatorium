<script>
	import { ChevronDown } from 'lucide-svelte';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	import * as HoverCard from '$lib/components/ui/hover-card/index.js';

	let mobileMenuOpen = false;

	let navigation = [
		{
			name: 'home',
			link: '/'
		},
		{
			name: 'facilities',
			link: '/facilities'
		},
		{
			name: 'online booking',
			link: '/online-booking'
		},
		{
			name: 'about mumbai',
			link: 'about-mumbai',

			subMenu: [
				{
					name: 'overview',
					link: '#overview'
				},
				{
					name: 'sightseeing',
					link: '#sightseeing'
				},
				{ name: 'transport', link: '#transport' }
			]
		},
		{
			name: 'photo gallery',
			link: '/photo-gallery'
		},
		{
			name: 'contact us',
			link: '/contact-us'
		}
	];

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<nav>
	<div
		class="flex w-100 justify-center flex-wrap gap-4 lg:justify-between lg:items-center lg:gap-0 lg:container lg:my-5"
	>
		<img src="/images/dr.syednaMohammad.png" class="w-28 lg:order-1 lg:w-auto lg:h-40" alt="" />
		<img src="/images/dr.syednaMufadal.png" class="w-28 lg:order-3 lg:w-auto lg:h-40" alt="" />
		<img src="/images/logo.png" alt="apsanatorium" class="w-5/6 lg:order-2 lg:w-auto" />
	</div>

	<div class="bg-apsanatorium_blue">
		<div class="container px-2 sm:px-6 lg:px-8">
			<div class="relative flex h-16 items-center justify-between">
				<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
					<!-- Mobile menu button-->
					<button
						type="button"
						class="relative inline-flex items-center justify-center rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
						aria-controls="mobile-menu"
						aria-expanded="false"
						on:click={toggleMobileMenu}
					>
						<span class="absolute -inset-0.5"></span>
						<span class="sr-only">Open main menu</span>
						<!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          -->
						<svg
							class="{mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							/>
						</svg>
						<!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          -->
						<svg
							class="{mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="flex flex-1 items-center justify-center">
					<div class="hidden sm:ml-6 sm:block">
						<div class="flex space-x-4">
							<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
							{#each navigation as navLinkObj}
								<!-- If there is a submenu creating collapsible -->
								{#if navLinkObj.hasOwnProperty('subMenu')}
									<HoverCard.Root openDelay={100}>
										<HoverCard.Trigger
											href={navLinkObj.link}
											rel="noreferrer noopener"
											class="capitalize px-3 py-2 font-medium text-white"
										>
											{navLinkObj.name}
										</HoverCard.Trigger>
										<HoverCard.Content class="bg-apsanatorium_blue w-auto">
											<div>
												{#each navLinkObj.subMenu as subMenuObj}
													<a
														class="capitalize block px-3 py-2 font-medium text-white"
														href={`${navLinkObj.link}/${subMenuObj.link}`}>{subMenuObj.name}</a
													>
												{/each}
											</div>
										</HoverCard.Content>
									</HoverCard.Root>
								{:else}
									<a
										href={navLinkObj.link}
										class="capitalize px-3 py-2 font-medium text-white"
										aria-current="page"
									>
										{navLinkObj.name}
									</a>
								{/if}
							{/each}
						</div>
					</div>
				</div>
				<div
					class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
				></div>
			</div>
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	<div class="{mobileMenuOpen ? 'block' : 'hidden'} sm:hidden" id="mobile-menu">
		<div class="space-y-1 px-2 pb-3 pt-2 bg-apsanatorium_blue">
			<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
			{#each navigation as navLinkObj}
				<!-- If there is a submenu creating collapsible -->
				{#if navLinkObj.hasOwnProperty('subMenu')}
					<Collapsible.Root class="w-[350px] space-y-2">
						<div class="flex items-center justify-between space-x-4 px-3">
							<a href={navLinkObj.link} class="capitalize font-medium text-white">
								{navLinkObj.name}
							</a>
							<Collapsible.Trigger asChild let:builder>
								<Button builders={[builder]} size="sm" class="w-9 p-0 bg-inherit hover:bg-inherit">
									<ChevronDown class="h-4 w-4 text-white" />
									<span class="sr-only">Toggle</span>
								</Button>
							</Collapsible.Trigger>
						</div>
						<Collapsible.Content class="space-y-2 p-3">
							{#each navLinkObj.subMenu as subMenuObj}
								<a
									class="capitalize block px-3 py-2 text-sm font-medium text-white"
									href={`${navLinkObj.link}/${subMenuObj.link}`}>{subMenuObj.name}</a
								>
							{/each}
						</Collapsible.Content>
					</Collapsible.Root>
				{:else}
					<a
						href={navLinkObj.link}
						on:click={toggleMobileMenu}
						id={`mobile-menu-item-${navLinkObj.name}`}
						class="block rounded-md capitalize px-3 py-2 text-base font-medium text-white hover:bg-blue-700 hover:text-white"
						>{navLinkObj.name}</a
					>
				{/if}
			{/each}
			<!-- <a
				href="#"
				class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
				aria-current="page">Dashboard</a
			> -->
		</div>
	</div>
</nav>
