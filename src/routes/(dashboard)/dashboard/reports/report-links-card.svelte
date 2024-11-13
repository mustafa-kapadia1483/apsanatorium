<script>
	export let title;
	export let reports;
	import ReportLink from './report-link.svelte';
</script>

<div class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
	<h3 class="text-lg font-semibold mb-3">{title}</h3>
	<ul class="list-none space-y-1">
		{#each reports as { href, text }}
			<li>
				<ReportLink {href} {text} />
			</li>
		{/each}
	</ul>
</div>
