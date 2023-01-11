<script>
	import { gameStore, mediaStore } from "$stores";
</script>

<header>
	{#if $mediaStore.screen.tablet}
		<div style="background: red; width: 100%">--</div>
	{/if}
	<button>MENU</button>
	<img src="/images/logo.svg" alt="logo" />
	<button on:click={gameStore.resetGame}>RESTART</button>
</header>

<style>
	header {
		margin-top: 40px;
		display: flex;
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
</style>
