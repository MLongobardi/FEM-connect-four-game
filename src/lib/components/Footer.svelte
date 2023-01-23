<script>
	import { gameStore } from "$stores";
	import { FixedTurnBackground, WinBox } from "$comps";

	let colors = ["var(--pink)", "var(--yellow)", "var(--dark-purple)"];
	//$: console.log($gameStore.timer)
</script>

<footer style:--color={colors[$gameStore.winInfo.player]}>
	{#if $gameStore.gameOver}
		<WinBox />
	{:else}
		<FixedTurnBackground
			color={$gameStore.currentPlayer == 0 ? "red" : "yellow"}
			time={$gameStore.timer.currentTime}
		/>
	{/if}
	<div style="background: white; position: absolute; z-index: 1; width: 100%; top: 50%;">
		TEMP
		<button
			on:click={() => {
				gameStore.undoLastMove();
				if ($gameStore.currentMode == "PVC") gameStore.undoLastMove();
			}}>undo last move</button
		>
		<button on:click={gameStore.startTimer}>start timer</button>
		<button on:click={gameStore.pauseTimer}>pause timer</button>
	</div>
</footer>

<style>
	footer {
		flex-grow: 1;
		--neg-margin: 40px;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		border-radius: 60px 60px 0 0;
		background-color: var(--color);
		height: calc(160px + var(--neg-margin));
		width: 100%;
		transition: background-color 200ms;
		transition-delay: 250ms;
		margin-top: calc(-1 * var(--neg-margin));
	}

	footer :global(svg) {
		position: relative;
		z-index: 2;
	}
</style>
