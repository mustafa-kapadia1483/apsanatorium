<script>
	import { cn } from '$lib/utils.js';
	export let variant;
	let className = '';
	export { className as class };

	let styles = 'bg-blue-50 text-blue-700 text-sm font-semibold';
	if (variant == 'red') {
		styles = 'text-white bg-red-900 font-bold';
	}
</script>

<div class={cn(styles, 'rounded-md', className)}>
	<slot />
</div>
