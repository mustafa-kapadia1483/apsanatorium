<script>
	import GradientHeader from '$lib/components/ui/gradient-header.svelte';
	import DateRangeSelector from '$lib/components/ui/date-range-selector.svelte';
</script>

<div class="container border border-blue-300">
	<GradientHeader>Collection Report</GradientHeader>
	<div>
		<DateRangeSelector />
		<div class="flex gap-4">
			<div>
				<label for="type">Type</label>
				<select class="border border-gray-300 p-1" name="type" id="type">
					<option value="all">All</option>
					<option value="advance">Advance</option>
					<option value="rent">Rent</option>
					<option value="refund">Refund</option>
				</select>
			</div>
			<div>
				<label for="payment-type">Payment Type</label>
				<select class="border border-gray-300 p-1" name="payment-type" id="payment-type">
					<option value="all">All</option>
					<option value="cash">Cash</option>
					<option value="cheque">Cheque</option>
					<option value="credit-card">Credit Card</option>
				</select>
			</div>
		</div>
	</div>
</div>
