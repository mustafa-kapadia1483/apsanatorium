<script>
	import {
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell
	} from '$lib/components/ui/table';
	import { cn } from '$lib/utils.js';

	export let tableHeaders;
	export let tableBody;

	// Individual class props for styling
	export let tableClass = '';
	export let headerRowClass = '';
	export let headerCellClass = '';
	export let bodyRowClass = '';
	export let bodyCellClass = '';
	export let emptyMessageClass = '';
</script>

<Table class={tableClass}>
	<TableHeader>
		<TableRow class={headerRowClass}>
			{#if tableBody.length > 0}
				{#each tableHeaders as header}
					<TableHead class={headerCellClass}>{header}</TableHead>
				{/each}
			{/if}
		</TableRow>
	</TableHeader>
	<TableBody>
		{#each tableBody as body}
			<TableRow class={bodyRowClass}>
				{#each tableHeaders as header}
					<TableCell class={bodyCellClass}>{body[header]}</TableCell>
				{/each}
			</TableRow>
		{/each}
		{#if tableBody.length === 0}
			<TableRow>
				<TableCell
					colSpan={tableHeaders.length}
					class={cn('text-center border border-gray-200', emptyMessageClass)}
				>
					No Records Found.
				</TableCell>
			</TableRow>
		{/if}
	</TableBody>
</Table>
