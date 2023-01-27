<script>
	import { gameStore } from "$stores";
	import { Dialog, PauseBox } from "$comps"
	export let menuDialog;
	export let pauseDialog;
</script>

<header>
	<button on:click={()=>{pauseDialog.myShowModal()}}>MENU</button>
	<img src="/images/logo.svg" alt="logo"/>
	<button on:click={gameStore.resetGame}>RESTART</button>
	<Dialog useTimer let:dialog bind:dialog={pauseDialog}>
		<PauseBox thisDialog={dialog} menuDialog={menuDialog}/>
	</Dialog>
</header>

<style lang="scss">
	header {
		display: flex;
		margin-top: 20px;
		max-width: 630px;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	button {
		@extend %small-button;
	}
	button:nth-of-type(1) {
		margin-right: 22px;
	}
</style>
