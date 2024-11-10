<script>
	import { cn } from '$lib/utils.js';
	let className = undefined;
	export { className as class };
</script>

<h2
	class={cn(
		'text-center text-lg font-extrabold bg-gradient-to-b from-blue-700 to-blue-950 text-white py-2',
		className
	)}
>
	<slot />
</h2>
