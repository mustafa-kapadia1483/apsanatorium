<script>
	import { cn } from '$lib/utils.js';
	export let id;
	export let name;
	export let value;
	let className = undefined;
	export { className as class };
</script>

<input
	{id}
	{name}
	type="text"
	bind:value
	class={cn(
		'rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
		className
	)}
/>
