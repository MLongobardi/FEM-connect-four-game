<script>
	import { gameStore } from "$stores";
	import { FixedTurnBackground } from "$comps";

	let colors = ["var(--pink)", "var(--yellow)", "var(--dark-purple)"];
	//$: console.log($gameStore.timer)
</script>

<footer style:--color={colors[$gameStore.winInfo.player]}>
	<FixedTurnBackground color={$gameStore.currentPlayer == 0 ? "red" : "yellow"} time={$gameStore.timer.currentTime}/>
	<div style="background: white">
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
		border-radius: 60px 60px 0 0;
		background-color: var(--color);
		height: calc(160px + var(--neg-margin));
		width: 100%;
		transition: background-color 200ms;
		transition-delay: 250ms;
		text-align: center;
		margin-top: calc(-1 * var(--neg-margin));
	}
</style>
