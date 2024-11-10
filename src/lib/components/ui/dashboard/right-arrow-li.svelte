<script>
	import { ArrowRight } from 'lucide-svelte';
	import { cn } from '$lib/utils.js';
	let className = '';
	export { className as class };
</script>

<li class={cn('flex items-center gap-4', className)}>
	<ArrowRight size={15} />
	<span><slot /></span>
</li>
