<script>
	import { cn } from '$lib/utils.js';
	let className = undefined;
	export let value;
	export { className as class };
</script>

<input
	class={cn(
		'rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
		className
	)}
	type="date"
	{value}
	{...$$restProps}
/>
