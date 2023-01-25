<script>
	import { Header, Main, Footer, Overlay, Dialog } from "$comps";
	import { frontStore, gameStore } from "$stores";
	import { onMount } from "svelte";

	onMount(() => {
		frontStore.openModal("menu"); //modals' in:fade transition triggers on $frontStore.currentModal changes
		
		document.addEventListener("visibilitychange", (event) => {
			if (document.visibilityState == "hidden" && $gameStore.timer.running) {
				gameStore.pauseTimer();
				frontStore.openModal("pause");
			}
		});
	});
</script>

<div class="page">
	{#if $frontStore.showModal}
		<Overlay />
	{/if}
	<div style="display: contents">
	<span style="flex-grow: 2;" />
	<Header />
	<span style="flex-grow: 4;" />
	<Main />
	<Footer />
	</div>
	<!--
	<Dialog let:dialog>
		<button on:click={()=>{dialog.close()}}>ciao</button>
	</Dialog>
	-->
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
