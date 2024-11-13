<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import ReportLinksCard from './report-links-card.svelte';

	const reports = [
		{ href: '/dashboard/reports/collection-report', text: 'Collection Report' },
		{ href: '/dashboard/reports/room-gst-report', text: 'Room GST Report' },
		{ href: '/dashboard/reports/zero-deposit-guest', text: 'Guest with Zero Deposit' },
		{ href: '/dashboard/reports/saifee-room-report', text: 'Saifee Reports' }
	];
</script>

<div class="container border-r-apsanatorium_blue">
	<GradientHeader>Reports</GradientHeader>
	<div class="flex gap-2 mt-2">
		<ReportLinksCard {reports} title="Accounting Reports" />
	</div>
</div>
