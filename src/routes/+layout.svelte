<script>
	import '../app.css';
	import Footer from '../components/footer.svelte';
</script>

<nav>
	<div class="flex w-100 justify-center flex-wrap gap-4">
		<img src="/images/dr.syednaMohammad.png" class="w-28" alt="" />
		<img src="/images/dr.syednaMufadal.png" class="w-28" alt="" />
		<img src="/images/logo.png" alt="apsanatorium" class="w-5/6" />
	</div>
</nav>

<slot />

<Footer />
