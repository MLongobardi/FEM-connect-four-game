<script>
	import { getAIMove } from "$scripts/computer-ai.js";
	import { gameStore } from "$scripts/store.js";
	import { Board } from "$comps";
	
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
	<div>
		current player: <img
			src="/images/player-{$gameStore.currentPlayer ? 'two' : 'one'}.svg"
			alt="current-player"
		/>
	</div>

	<div id="game-table">
		{#each $gameStore.board.table as row, j ("r" + j)}
			<div class="game-row" id={"r" + j}>
				{#each row as cell, i ("c" + j + i)}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="game-cell"
						id={"c" + j + i}
						style:background={$gameStore.winInfo.cells.includes(j + "," + i)
							? "lightgreen"
							: "none"}
						on:click={() => {
							gameStore.playMove(i);
							if (playAgainstAI)
								setTimeout(() => {
									gameStore.playMove(getAIMove($gameStore, nextDepth));
								}, 150);
						}}
					>
						{#if cell == 0}
							<img src="/images/player-one.svg" alt="player-one" draggable="false" />
						{:else if cell == 1}
							<img src="/images/player-two.svg" alt="player-two" draggable="false" />
						{:else}
							<span class="empty" />
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div>
		<button on:click={gameStore.resetGame}>reset game</button>
		<span style="display: inline-flex; flex-direction: column">
			<button
				on:click={() => {
					gameStore.playMove(getAIMove($gameStore, nextDepth));
				}}>ai move</button
			>
		</span>
		<label><input type="checkbox" bind:checked={playAgainstAI} />play against ai</label>
		<label><input type="number" bind:value={nextDepth} min="1" max="9" /> ai difficulty</label>
	</div>

	<Board />
</main>

<style>
	main {
		flex-grow: 1; /*child of .page in App.svelte*/
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	#game-table {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		width: 700px;
	}

	.game-row {
		display: flex;
	}

	.game-cell {
		padding: 20px;
	}

	.empty {
		display: block;
		width: 54px;
		height: 54px;
		margin-top: 2px;
		margin-bottom: 7px;
		background: grey;
		border-radius: 50%;
	}
</style>
