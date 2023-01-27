<script>
	import { gameStore } from "$stores";
    import { fade } from "svelte/transition";
</script>

<div class="win-box" in:fade={{duration: 200}}>
	{#if $gameStore.winInfo.player == 2}
		<span class="win-text">DRAW</span>
	{:else if $gameStore.currentMode == "PVP"}
		<span class="winner">PLAYER {$gameStore.winInfo.player + 1}</span>
		<span class="win-text">WINS</span>
	{:else if $gameStore.currentMode == "PVC"}
        <span class="winner">YOU</span>
		<span class="win-text">{$gameStore.winInfo.player == 0 ? "WIN" : "LOSE"}</span>
	{:else}
		gameStore.currentMode isn't set to "PVP" or "PVC"!
	{/if}
	<button on:click={gameStore.resetGame}>PLAY AGAIN</button>
</div>

<style lang="scss">
	.win-box {
		@extend %box-shadow;
		@extend %hover-on-footer;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 285px;
		padding: 17px 0;
		border-radius: 20px;
		background: white;
	}

	.winner {
		@extend %heading-XS;
	}

	.win-text {
		margin: -7px 0 3px 0;
		@extend %heading-L;
	}

	button {
		@extend %small-button;
	}
</style>
