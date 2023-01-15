<script>
	import { gameStore, mediaStore, frontStore } from "$stores";
</script>

<header>
	<button on:click={()=>{frontStore.openModal("pause")}}>MENU</button>
	<img src="/images/logo.svg" alt="logo"/>
	<button on:click={gameStore.resetGame}>RESTART</button>
</header>

<style>
	header {
		display: flex;
		margin-top: 20px;
		max-width: 630px;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	button {
		background: var(--dark-purple);
		border-radius: 20px;
		color: white;
		border: none;
		padding: 10px 20px;
		font-weight: bold;
		height: fit-content;
	}
	button:hover {
		background: var(--pink)
	}
	button:nth-of-type(1) {
		margin-right: 22px;
	}
</style>
