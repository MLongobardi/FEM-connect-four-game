<script>
	import { Header, Main, Footer, Overlay } from "$comps";
	import { frontStore } from "$stores";
</script>

<div class="page">
	{#if $frontStore.showModal}
		<Overlay />
	{/if}
	<span style="flex-grow: 2;" />
	<Header />
	<span style="flex-grow: 4;" />
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
