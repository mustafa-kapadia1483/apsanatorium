<script>
	import {
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell
	} from '$lib/components/ui/table';
	import { FileSpreadsheet } from 'lucide-svelte';
	import { utils, writeFileXLSX } from 'xlsx';
	import { cn } from '$lib/utils.js';
	export let tableHeaders;
	export let tableBody;
	export let fileName;
	export let title;
	let className = '';
	export { className as class };

	function exportFile() {
		try {
			// Create worksheet with headers
			const ws = utils.json_to_sheet(tableBody, {
				header: tableHeaders
			});

			const wb = utils.book_new();
			utils.book_append_sheet(wb, ws, 'Sheet1');

			// Add error handling and ensure filename is valid
			const safeFileName = fileName?.trim() || 'export';
			writeFileXLSX(wb, `${safeFileName}.xlsx`);
		} catch (error) {
			console.error('Export failed:', error);
			alert('Failed to export file. Please try again.');
		}
	}
</script>

<div>
	<div class={className}>
		<h2 class="text-lg text-center font-bold">{title}</h2>
		<div class="flex justify-between items-end mb-2 mx-2">
			<span class="text-sm text-gray-600">Total Records: {tableBody.length}</span>
			{#if tableBody.length > 0}
				<button
					class="flex gap-2 items-center text-sm text-[#217346] hover:text-[#1a5c38] transition-colors bg-[#e6f3ea] hover:bg-[#d4eadc] px-3 py-1.5 rounded-md"
					on:click={exportFile}
				>
					<FileSpreadsheet size={16} />
					<span>Export to Excel</span>
				</button>
			{/if}
		</div>
	</div>
	<Table>
		<TableHeader>
			<TableRow>
				{#if tableBody.length > 0}
					{#each tableHeaders as header}
						<TableHead>{header}</TableHead>
					{/each}
				{/if}
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each tableBody as body}
				<TableRow>
					{#each tableHeaders as header}
						<TableCell>{body[header]}</TableCell>
					{/each}
				</TableRow>
			{/each}
			{#if tableBody.length === 0}
				<TableRow>
					<TableCell colSpan={tableHeaders.length} class="text-center border border-gray-200">
						No Records Found.
					</TableCell>
				</TableRow>
			{/if}
		</TableBody>
	</Table>
</div>
