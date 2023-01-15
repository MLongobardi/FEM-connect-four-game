<script>
	import { getAIMove } from "$scripts/computer-ai.js";
	import { gameStore, mediaStore } from "$stores";
	import { Board, ScoreCard } from "$comps";

	function testAlgTime(algDepth, onlyOnce = true) {
		gameStore.hardReset();
		console.time("total");
		while (!$gameStore.gameOver) {
			console.time("thisMove");
			gameStore.playMove(getAIMove($gameStore, algDepth));
			console.timeEnd("thisMove");
			if (onlyOnce) break;
		}
		console.timeEnd("total");
	}
	//testAlgTime(5, false)
</script>

{#if $mediaStore.screen.desktop == true}
	<main class="big">
		<ScoreCard mode={$gameStore.currentMode} position="left" />
		<Board />
		<ScoreCard mode={$gameStore.currentMode} position="right" />
	</main>
{:else}
	<main>
		<div class="score-holder">
			<ScoreCard mode={$gameStore.currentMode} position="left" />
			<ScoreCard mode={$gameStore.currentMode} position="right" />
		</div>
		<Board />
	</main>
{/if}

<style>
	main.big {
		display: grid;
		grid-template-columns: 180px 1fr 180px;
		justify-items: center;
		align-items: center;
	}

	.score-holder {
		display: flex;
		justify-content: space-between;
		margin: 15px 0;
	}
</style>
