<script>
	import { gameStore, mediaStore } from "$stores";
	import { Dialog, PauseBox } from "$comps"
	export let menuDialog;
	export let pauseDialog;
</script>

<header class:big={!$mediaStore.screen.mobile}>
	<h1>Connect 4 Game</h1>
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
		//margin-top: 20px;
		width: minMaxSize(335px, 632px);
		justify-content: space-between;
		align-items: center;
	}

	h1 {
		/*For accessibility*/
		font-size: 0;
		width: 1px;
		height: 1px;
		display: inline-block;
		overflow: hidden;
		position: absolute!important;
		border: 0!important;
		padding: 0!important;
		margin: 0!important;
		clip: rect(1px,1px,1px,1px);
	}

	img {
		width: 46px;
		height: 46px;
	}
	.big img {
		width: unset;
		height: unset;
	}

	button {
		@extend %small-button;
	}
</style>
