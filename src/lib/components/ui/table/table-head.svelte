<script>
	import { cn } from '$lib/utils.js';
	let className = undefined;
	export { className as class };
</script>

<th
	class={cn(
		'text-muted-foreground h-8 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
		className
	)}
	{...$$restProps}
>
	<slot />
</th>
