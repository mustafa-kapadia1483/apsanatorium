<script>
	export let startText;
	export let endText = null;
</script>

<div class={`border border-black mx-2 mt-5 ${$$props.class ?? ''}`.trim()}>
	<h3 class="text-red-900 left-2 relative px-0.5">
		<span class="bg-white px-0.5 font-bold -top-2.5 absolute">
			{startText}
		</span>
		{#if endText}
			<span class="bg-white px-0.5 mr-4 text-sm absolute -top-2.5 right-0">
				{endText}
			</span>
		{/if}
	</h3>
	<slot />
</div>
