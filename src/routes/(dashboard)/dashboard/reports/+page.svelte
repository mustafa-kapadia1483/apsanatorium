<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
</script>

<div class="container border-r-apsanatorium_blue">
	<GradientHeader>Reports</GradientHeader>
	<h3>Accounting Reports</h3>
	<ul>
		<li>
			<a href="/dashboard/reports/collection-report" class="text-red-600">Collection Report</a>
			<a href="/dashboard/reports/room-gst-report" class="text-red-600">Room GST Report</a>
			<a href="/dashboard/reports/zero-deposit-guest" class="text-red-600">
				Guest with Zero Deposit
			</a>
		</li>
	</ul>
</div>
