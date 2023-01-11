<script>
	import { getAIMove } from "$scripts/computer-ai.js";
	import { gameStore } from "$stores";
	import { Board, FixedTurnBackground } from "$comps";

	function testAlgTime(algDepth, onlyOnce = true) {
		console.time("total");
		while (!$gameStore.gameOver) {
			console.time("thisMove");
			gameStore.playMove(getAIMove($gameStore, algDepth));
			console.timeEnd("thisMove");
			if (onlyOnce) break;
		}
		console.timeEnd("total");
	}
	//testAlgTime(6, false)
</script>

<main>
	<Board />
	<FixedTurnBackground color={$gameStore.currentPlayer == 0 ? "red" : "yellow"} />
</main>

<style>
	main {
		flex-grow: 1; /*child of .page in App.svelte*/
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}
</style>
