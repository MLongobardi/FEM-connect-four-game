<script>
	import { getAIMove } from "$scripts/computer-ai.js";
	import { gameStore } from "$scripts/store.js";
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

	let playAgainstAI = false;
	let nextDepth = 5;
</script>

<svelte:head>
	<link rel="preload" as="image" href="/images/player-one.svg" />
	<link rel="preload" as="image" href="/images/player-two.svg" />
</svelte:head>

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
	}
</style>
