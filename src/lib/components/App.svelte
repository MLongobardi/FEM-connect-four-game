<script>
	import { Header, Main, Footer } from "$comps";
</script>

<div class="page">
	<Header />
	<Main />
	<Footer />
</div>

<style>
	:global(body) {
		background: var(--purple);
	}
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 100vh;
	}
</style>
