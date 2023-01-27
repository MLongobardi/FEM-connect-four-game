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
	<!--
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
	-->
</footer>

<style lang="scss">
	footer {
		flex-basis: minMaxSize(234px, 200px, 768px, 1440px); //height
		flex-grow: 0.1; //very slightly tweaks height;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		border-radius: 60px 60px 0 0;
		background-color: var(--color);
		
		width: 100%;
		transition: background-color 200ms;
		transition-delay: 250ms;
		margin-top: minMaxSize(-15px, -50px)
	}

	footer :global(svg) {
		@extend %hover-on-footer;
	}
</style>
