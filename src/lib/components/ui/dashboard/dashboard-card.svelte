<script>
	import { cn } from '$lib/utils.js';
	let className = '';
	export { className as class };
</script>

<div class={cn('rounded-md border border-blue-400', className)}>
	<slot />
</div>
