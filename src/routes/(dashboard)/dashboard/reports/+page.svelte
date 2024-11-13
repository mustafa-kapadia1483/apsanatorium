<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import ReportLinksCard from './report-links-card.svelte';

	const reports = [
		{ href: '/dashboard/reports/collection-report', text: 'Collection Report' },
		{ href: '/dashboard/reports/zero-deposit-guest', text: 'Guest with Zero Deposit' },
		{ href: '/dashboard/reports/outstanding-report', text: 'Outstanding Reports' },
		{ href: '/dashboard/reports/saifee-room-report', text: 'Saifee Reports' },
		{ href: '/dashboard/reports/short-stay-report', text: 'Short Stay Record Report' },
		{
			href: '/dashboard/reports/non-adjusted-advances-amount-report',
			text: 'Non Adjusted Advances Amount Report'
		},
		{ href: '/dashboard/reports/room-gst-report', text: 'Room GST Report' }
	];
</script>

<div class="container border-r-apsanatorium_blue">
	<GradientHeader>Reports</GradientHeader>
	<div class="flex gap-2 mt-2">
		<ReportLinksCard {reports} title="Accounting Reports" />
	</div>
</div>
