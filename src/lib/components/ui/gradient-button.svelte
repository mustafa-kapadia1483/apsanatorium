<script>
	import { cn } from '$lib/utils.js';
	let className = undefined;
	export { className as class };
</script>

<button
	class={cn('text-white bg-gradient-to-b from-blue-500 to-blue-950 py-0.5 px-2 text-xs', className)}
	{...$$restProps}
>
	<slot />
</button>
