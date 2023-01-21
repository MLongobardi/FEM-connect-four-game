<script>
	import { gameStore, frontStore } from "$stores";

	function handlePause() {
		gameStore.pauseTimer();
		frontStore.openModal("pause");
	}
</script>

<header>
	<button on:click={handlePause}>MENU</button>
	<img src="/images/logo.svg" alt="logo"/>
	<button on:click={gameStore.resetGame}>RESTART</button>
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
