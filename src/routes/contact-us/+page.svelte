<script>
	import Pagecontainer from '$lib/components/pagecontainer.svelte';
	import { Mail, Smartphone } from 'lucide-svelte';

	let contactUsCards = [
		{
			icon: Mail,
			title: 'E-mail',
			contact: 'booking@apsanatorium.com',
			type: 'mailto:'
		},
		{
			icon: Smartphone,
			title: 'Mobile Number',
			contact: '+91-9833802410',
			type: 'tel:'
		},
		{
			icon: Mail,
			title: 'Telephone',
			contact: '+91-022-23814427',
			type: 'tel:'
		}
	];
</script>

<Pagecontainer title="Contact Us">
	<iframe
		src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3773.533364786531!2d72.81853599999998!3d18.95203797072332!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce114f2b1c27%3A0xcb695c282f9b7de3!2sAdamji%20Peerbhoy%20Sanatorium%20Trust!5e0!3m2!1sen!2sin!4v1726067312939!5m2!1sen!2sin"
		width="600"
		height="450"
		style="border:0;"
		allowfullscreen=""
		class="w-full"
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
		title="google map"
	></iframe>

	<div class="py-4">
		<h1 class="text-2xl text-apsanatorium_font_blue text-center">
			Adamji Peerbhoy Sanatorium Trust
		</h1>
		<address class="text-sm text-center">
			15/17 Maharshi Karve Marg Next to Saifee Hospital, Mumbai 400 004 India.
		</address>
		<div class="grid gap-4 px-4 mt-5 sm:grid-cols-3">
			{#each contactUsCards as { icon, title, contact, type }}
				<div
					class="text-apsanatorium_font_blue border border-gray-500 flex items-center gap-2 px-3 py-2"
				>
					<svelte:component this={icon} />
					<a href={type + contact}>{title}: {contact}</a>
				</div>
			{/each}
		</div>
	</div>
</Pagecontainer>
