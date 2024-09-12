<script>
	import { ArrowRight } from 'lucide-svelte';
</script>

<li class={`flex items-center gap-4 ${$$props.class}`}>
	<ArrowRight size={15} />
	<span><slot /></span>
</li>
