<script>
	export let title;
</script>

<div class="sm:container border-r-2 border-l-2 border-gray-200 sm:px-0 pb-3">
	<h1 class="text-4xl bg-gray-100 pl-2 py-3">{title}</h1>
	<slot />
</div>
