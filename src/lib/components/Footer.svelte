<script>
	import { gameStore } from "$stores";
	import { FixedTurnBackground, WinBox } from "$comps";

	let colors = ["var(--pink)", "var(--yellow)", "var(--dark-purple)"];
	let texts = {
		PVP: ["PLAYER 1'S TURN", "PLAYER 2'S TURN"],
		PVC: ["YOUR TURN", "CPU'S TURN"],
	};
</script>

<footer style:--color={colors[$gameStore.winInfo.player]}>
	{#if $gameStore.gameOver}
		<WinBox />
	{:else}
		<FixedTurnBackground
			color={$gameStore.currentPlayer == 0 ? "red" : "yellow"}
			turnText={texts[$gameStore.currentMode][$gameStore.currentPlayer]}
			time={$gameStore.timer.currentTime}
		/>
	{/if}
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
		margin-top: minMaxSize(-15px, -50px);
	}

	footer :global(svg) {
		@extend %hover-on-footer;
	}
</style>
