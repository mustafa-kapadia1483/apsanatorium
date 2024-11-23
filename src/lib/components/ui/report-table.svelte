<script>
	import { utils, writeFileXLSX } from 'xlsx';
	import { FileSpreadsheet } from 'lucide-svelte';
	import {
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell,
		TableCaption
	} from '$lib/components/ui/table';
	import { cn } from '$lib/utils.js';

	export let tableBody;
	export let tableHeaders = tableBody?.[0] ? Object.keys(tableBody[0]) : [];
	export let fileName;
	export let title;

	// Updated styling props with reduced spacing
	export let containerClass = '';
	export let headerContainerClass = '';
	export let titleClass = '';
	export let statsContainerClass = '';
	export let statsTextClass = '';
	export let exportButtonClass = '';
	export let tableClass = 'w-full border-collapse min-w-full text-sm';
	export let headerRowClass = 'bg-gray-100 border-b';
	export let headerCellClass = 'px-2 py-1 text-left font-semibold text-gray-700 border';
	export let bodyRowClass = 'border-b hover:bg-gray-50';
	export let bodyCellClass = 'px-2 py-1 border text-gray-800';
	export let emptyMessageClass = 'text-center py-2 text-gray-500 text-sm';

	function exportFile(e) {
		try {
			const ws = utils.table_to_sheet(e.target.closest('table'));

			const wb = utils.book_new();
			utils.book_append_sheet(wb, ws, 'Sheet1');

			const safeFileName = fileName?.trim() || 'export';
			writeFileXLSX(wb, `${safeFileName}.xlsx`);
		} catch (error) {
			console.error('Export failed:', error);
			alert('Failed to export file. Please try again.');
		}
	}
</script>

<div class={containerClass}>
	<Table class={tableClass}>
		<TableCaption class={headerContainerClass}>
			<h2 class={cn('text-lg text-center font-bold', titleClass)}>{title}</h2>
			<div class={cn('flex justify-between items-end mb-2 mx-2', statsContainerClass)}>
				<span class={cn('text-sm text-gray-600', statsTextClass)}>
					Total Records: {tableBody.length}
				</span>
				{#if tableBody.length > 0}
					<button
						class={cn(
							'flex gap-2 items-center text-sm text-[#217346] hover:text-[#1a5c38]',
							'transition-colors bg-[#e6f3ea] hover:bg-[#d4eadc] px-3 py-1.5 rounded-md',
							exportButtonClass
						)}
						on:click={exportFile}
					>
						<FileSpreadsheet size={16} />
						<span>Export to Excel</span>
					</button>
				{/if}
			</div>
		</TableCaption>
		<TableHeader>
			<TableRow class={headerRowClass}>
				{#if tableBody.length > 0}
					{#each tableHeaders as header}
						<TableHead class={headerCellClass}>{header}</TableHead>
					{/each}
				{/if}
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each tableBody as body}
				<TableRow class={bodyRowClass}>
					{#each tableHeaders as header}
						<TableCell class={bodyCellClass}>{@html body[header]}</TableCell>
					{/each}
				</TableRow>
			{/each}
			{#if tableBody.length === 0}
				<TableRow>
					<TableCell
						colSpan={tableHeaders.length}
						class={cn('text-center border border-gray-200', emptyMessageClass)}
					>
						No Records Found.
					</TableCell>
				</TableRow>
			{/if}
		</TableBody>
	</Table>
</div>
