<script>
	import { Header, Main, Footer, Overlay } from "$comps";
	import { frontStore } from "$stores";
</script>

<div class="page">
	{#if $frontStore.showModal}
		<Overlay />
	{/if}
	<div>
		<!--temp: makes Header same width as Main-->
		<Header />
		<Main />
	</div>
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
