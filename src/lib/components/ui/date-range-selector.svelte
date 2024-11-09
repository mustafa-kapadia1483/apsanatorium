<script>
	import { strftime } from '$lib/utils/date-utils';
	export let startDate;
	export let endDate;

	function getDateRange(type) {
		const today = new Date();

		switch (type) {
			case 'today':
				startDate = new Date(today);
				endDate = new Date(today);
				break;
			case 'this-month':
				startDate = new Date(today.getFullYear(), today.getMonth(), 1);
				endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of this month
				break;

			case 'last-month':
				startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
				endDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month
				break;

			case 'this-financial-year':
				startDate = new Date(
					today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1,
					3,
					1
				); // Financial year starts in April
				endDate = today; // Until today's date
				break;

			case 'last-financial-year':
				startDate = new Date(
					today.getMonth() >= 3 ? today.getFullYear() - 1 : today.getFullYear() - 2,
					3,
					1
				);
				endDate = new Date(
					today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1,
					2,
					31
				); // End of March for the last financial year
				break;
			case 'last-30-days':
				startDate = new Date(today);
				startDate.setDate(today.getDate() - 30); // 30 days ago
				endDate = today; // Today's date
				break;

			default:
				throw new Error('Invalid type provided.');
		}

		return {
			startDate,
			endDate
		};
	}

	function handleRadioChange(event) {
		const timeframe = event.target.value;
		const dateRange = getDateRange(timeframe);

		startDate = strftime('%F', dateRange.startDate);
		endDate = strftime('%F', dateRange.endDate);
	}
</script>

<div class={`flex gap-5 ${$$props.class}`}>
	<div>
		<label for="startDate">Date From:</label>
		<input class="border" type="date" name="startDate" id="startDate" bind:value={startDate} />
	</div>
	<div>
		<label for="endDate">Date To:</label>
		<input class="border" type="date" name="endDate" id="endDate" bind:value={endDate} />
	</div>
	<div class="flex gap-2 text-xs">
		<div class="flex items-center gap-1">
			<input type="radio" on:change={handleRadioChange} value="today" name="timeframe" id="today" />
			<label for="today">Today</label>
		</div>
		<div class="flex items-center gap-1">
			<input
				type="radio"
				on:change={handleRadioChange}
				value="this-month"
				name="timeframe"
				id="this-month"
			/>
			<label for="this-month">This Month</label>
		</div>
		<div class="flex items-center gap-1">
			<input
				type="radio"
				on:change={handleRadioChange}
				value="last-month"
				name="timeframe"
				id="last-month"
			/>
			<label for="last-month">Last Month</label>
		</div>
		<div class="flex items-center gap-1">
			<input
				type="radio"
				on:change={handleRadioChange}
				value="last-30-days"
				name="timeframe"
				id="last-30-days"
			/>
			<label for="last-30-days">Last 30 Days</label>
		</div>
		<div class="flex items-center gap-1">
			<input
				type="radio"
				on:change={handleRadioChange}
				value="this-financial-year"
				name="timeframe"
				id="this-financial-year"
			/>
			<label for="this-financial-year">This financial year</label>
		</div>
		<div class="flex items-center gap-1">
			<input
				type="radio"
				on:change={handleRadioChange}
				value="last-financial-year"
				name="timeframe"
				id="last-financial-year"
			/>
			<label for="last-financial-year">Last financial year</label>
		</div>
	</div>
</div>
