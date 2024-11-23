<script>
	import ReportTable from '$lib/components/ui/report-table.svelte';

	export let data;

	const roomRateCardData = data.roomRateCardData;
</script>

<div class="container border px-0 border-gray-200 mb-4">
	{#if roomRateCardData}
		<ReportTable title={`Room Rate Card`} tableBody={roomRateCardData} containerClass="mt-4" />
	{/if}
</div>
