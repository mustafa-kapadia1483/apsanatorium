<script>
	import '../../../app.css';
	export let data
</script>

<svelte:head>
	<title>AP Sanatorium</title>
</svelte:head>

<div class="px-4 py-2 flex justify-between border-b border-b-gray-400 text-sm">
	<div>Welcome <strong>{data.username}</strong></div>
	<div class="text-red-900 space-x-3">
		<a href="/dashboard" class="border-r border-r-red-900 pr-3">Main menu</a>
		<form class="inline" action="/dashboard/logout" method="post">
			<button type="submit" class="bg-none border-none text-inherit">Logout</button>
		</form>
	</div>
</div>

<slot />
