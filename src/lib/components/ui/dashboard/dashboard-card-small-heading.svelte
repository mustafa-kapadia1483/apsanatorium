<script>
	export let variant;

	let styles = 'text-center bg-blue-50 text-blue-700 text-sm font-semibold';
	if (variant == 'red') {
		styles = 'text-white bg-red-900 font-bold';
	}
</script>

<div class={`${styles} rounded-md ${$$props.class}`}>
	<slot />
</div>
