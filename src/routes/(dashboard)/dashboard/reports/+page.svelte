<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import ReportLinksCard from './report-links-card.svelte';

	const accountingReports = [
		{ href: '/dashboard/reports/accounting-reports/collection-report', text: 'Collection Report' },
		{
			href: '/dashboard/reports/accounting-reports/zero-deposit-guest',
			text: 'Guest with Zero Deposit'
		},
		{
			href: '/dashboard/reports/accounting-reports/outstanding-report',
			text: 'Outstanding Reports'
		},
		{ href: '/dashboard/reports/accounting-reports/saifee-room-report', text: 'Saifee Reports' },
		{
			href: '/dashboard/reports/accounting-reports/short-stay-report',
			text: 'Short Stay Record Report'
		},
		{
			href: '/dashboard/reports/accounting-reports/unadjusted-amount-report',
			text: 'Unadjusted Amount'
		},
		{
			href: '/dashboard/reports/accounting-reports/debit-credit-gst-report',
			text: 'Debit Credit GST Report'
		},
		{
			href: '/dashboard/reports/accounting-reports/non-adjusted-advances-report',
			text: 'Non Adjusted Advances Report'
		},
		{ href: '/dashboard/reports/accounting-reports/tax-report', text: 'Tax Report' },
		{ href: '/dashboard/reports/accounting-reports/stay-report', text: 'Stay Records Report' },
		{
			href: '/dashboard/reports/accounting-reports/cancellation-report',
			text: 'Cancellation Report'
		},
		{
			href: '/dashboard/reports/accounting-reports/short-invoice-report',
			text: 'Short Invoice Record Report'
		},
		{ href: '/dashboard/reports/accounting-reports/room-gst-report', text: 'Room GST Report' }
	];
	const adminReports = [
		{ href: '/dashboard/reports/admin-reports/generate-email-phone', text: 'Generate Email/Phone' }
	];
	const workingReports = [
		{
			href: '/dashboard/reports/working-reports/general-booking-report',
			text: 'General Booking Report'
		},
		{
			href: '/dashboard/reports/working-reports/guest-register',
			text: 'Guest Register'
		}
	];
</script>

<div class="container border-r-apsanatorium_blue">
	<GradientHeader>Reports</GradientHeader>
	<div class="flex gap-2 mt-2">
		<ReportLinksCard reports={workingReports} title="Working Reports" />
		<ReportLinksCard reports={accountingReports} title="Accounting Reports" />
		<ReportLinksCard reports={adminReports} title="Admin Reports" />
	</div>
</div>
