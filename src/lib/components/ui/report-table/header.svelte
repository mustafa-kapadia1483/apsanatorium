<script>
	import { FileSpreadsheet } from 'lucide-svelte';
	import { cn } from '$lib/utils.js';

	export let title;
	export let recordCount;
	export let onExport;

	// Individual class props for each element
	export let containerClass = '';
	export let titleClass = '';
	export let statsContainerClass = '';
	export let statsTextClass = '';
	export let exportButtonClass = '';
</script>

<div class={containerClass}>
	<h2 class={cn('text-lg text-center font-bold', titleClass)}>{title}</h2>
	<div class={cn('flex justify-between items-end mb-2 mx-2', statsContainerClass)}>
		<span class={cn('text-sm text-gray-600', statsTextClass)}>
			Total Records: {recordCount}
		</span>
		{#if recordCount > 0}
			<button
				class={cn(
					'flex gap-2 items-center text-sm text-[#217346] hover:text-[#1a5c38]',
					'transition-colors bg-[#e6f3ea] hover:bg-[#d4eadc] px-3 py-1.5 rounded-md',
					exportButtonClass
				)}
				on:click={onExport}
			>
				<FileSpreadsheet size={16} />
				<span>Export to Excel</span>
			</button>
		{/if}
	</div>
</div>
