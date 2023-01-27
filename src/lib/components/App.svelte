<script>
	import { Header, Main, Footer, Loading, Dialog, MenuBox } from "$comps";
	import { gameStore } from "$stores";
	import { onMount } from "svelte";
	
	let loading = true;
	let menuDialog, pauseDialog;
	onMount(() => {
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState == "hidden" && $gameStore.timer.running) {
				pauseDialog.myShowModal();
			}
		});

		loading = false;
	});
</script>

<div class="page">
	{#if loading}
		<Loading />
	{/if}

	<Dialog startOpen let:dialog bind:dialog={menuDialog}>
		<MenuBox thisDialog={dialog} />
	</Dialog>
	
	<span style="flex-grow: 2;" />
	<Header menuDialog={menuDialog} bind:pauseDialog/>
	<span style="flex-grow: 4;" />
	<Main />
	<Footer />
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 100vh;
	}
</style>
