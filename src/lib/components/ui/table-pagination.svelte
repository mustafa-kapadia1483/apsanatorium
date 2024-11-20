<script>
	import {
		Pagination,
		PaginationContent,
		PaginationItem,
		PaginationLink,
		PaginationPrevButton,
		PaginationNextButton,
		PaginationEllipsis
	} from '$lib/components/ui/pagination';
	import { cn } from '$lib/utils';

	export let currentPage;
	export let totalPages;
	export let onPageChange;
	let className = undefined;
	export { className as class };
</script>

{#if totalPages > 1}
	<Pagination
		class={cn('mb-4 mt-2', className)}
		bind:page={currentPage}
		count={totalPages}
		perPage={1}
		siblingCount={2}
		let:pages
		{onPageChange}
	>
		<PaginationContent>
			<PaginationItem>
				<PaginationPrevButton />
			</PaginationItem>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				{:else}
					<PaginationItem>
						<PaginationLink {page} isActive={currentPage === page.value}>
							{page.value}
						</PaginationLink>
					</PaginationItem>
				{/if}
			{/each}
			<PaginationItem>
				<PaginationNextButton />
			</PaginationItem>
		</PaginationContent>
	</Pagination>
{/if}
