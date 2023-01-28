<script>
	//import { getAIMove } from "$scripts/computer-ai.js";
	import { gameStore, mediaStore } from "$stores";
	import { Board, ScoreCard } from "$comps";

	/*
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
	*/
</script>

{#if $mediaStore.screen.desktop}
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

<style lang="scss">
	.score-holder {
		display: flex;
		justify-content: space-between;
		width: 95.5vw;
		max-width: minMaxSize(633px, 750px, 768px, 1080px);
	}

	main.big {
		display: grid;
		grid-template-columns: repeat(3, min-content);
		gap: minMaxSize(30px, 90px, 1200px, 1680px); //is 60px at 1440px screen, as per the design
		justify-items: center;
		align-items: center;
	}
</style>
