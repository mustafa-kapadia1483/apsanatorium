<script>
	import { utils, writeFileXLSX } from 'xlsx';
	import Header from './report-table/header.svelte';
	import Content from './report-table/content.svelte';

	export let tableHeaders;
	export let tableBody;
	export let fileName;
	export let title;

	// Optional styling props with empty defaults
	export let containerClass = '';
	export let headerContainerClass = '';
	export let titleClass = '';
	export let statsContainerClass = '';
	export let statsTextClass = '';
	export let exportButtonClass = '';
	export let tableClass = '';
	export let headerRowClass = '';
	export let headerCellClass = '';
	export let bodyRowClass = '';
	export let bodyCellClass = '';
	export let emptyMessageClass = '';

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
