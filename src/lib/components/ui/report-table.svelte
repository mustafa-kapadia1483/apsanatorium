<script>
	import { utils, writeFileXLSX } from 'xlsx';
	import Header from './report-table/header.svelte';
	import Content from './report-table/content.svelte';

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

	function exportFile() {
		try {
			const ws = utils.json_to_sheet(tableBody, {
				header: tableHeaders
			});

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
	<Header
		{title}
		containerClass={headerContainerClass}
		{titleClass}
		{statsContainerClass}
		{statsTextClass}
		{exportButtonClass}
		recordCount={tableBody.length}
		onExport={exportFile}
	/>
	<Content
		{tableHeaders}
		{tableBody}
		{tableClass}
		{headerRowClass}
		{headerCellClass}
		{bodyRowClass}
		{bodyCellClass}
		{emptyMessageClass}
	/>
</div>
