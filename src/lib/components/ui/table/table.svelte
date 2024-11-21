<script>
	import { cn } from '$lib/utils.js';
	let className = undefined;
	export { className as class };
</script>

<div class="relative w-full overflow-auto">
	<table class={cn('w-full text-sm', className)} {...$$restProps}>
		<slot />
	</table>
</div>
