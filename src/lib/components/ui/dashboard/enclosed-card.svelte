<script>
	import { cn } from '$lib/utils.js';
	export let startText;
	export let endText = null;
	export let highlight = false;
	let className = '';
	export { className as class };
	let background = highlight ? 'bg-highlight' : 'bg-white';
</script>

<div class={cn('border border-black mx-2 mt-5', background, className)}>
	<h3 class="text-red-900 left-2 relative px-0.5">
		<span class={cn(background, 'px-1 font-bold -top-2.5 absolute')}>
			{startText}
		</span>
		{#if endText}
			<span class={cn(background, 'px-1 mr-4 text-sm absolute -top-2.5 right-0')}>
				{endText}
			</span>
		{/if}
	</h3>
	<slot />
</div>
