<script>
	import { onMount } from "svelte";
	import { gameStore } from "$scripts/store.js";
	import { getAIMove } from "$scripts/computer-ai.js";
	import { Piece } from "$comps";

	let breakPoint = "(min-width: 600px)";
	let test = { matches: false };
	onMount(() => {
		test = window.matchMedia(breakPoint);
		test.addEventListener("change", () => {
			test = test; //triggers reactivity;
		});
	});
	//Make a separate matchMedia store, make it so I can also retrieve the breakPoints (so, store.mobileBreakPoint or something) so I can use it for the <picture> tags (also in Piece.svelte, so I don't need to pass breakPoint as a prop)

	$: markerColor = $gameStore.currentPlayer == 0 ? "red" : "yellow";
	$: showMarker = $gameStore.gameOver ? "hidden" : "visible";

	let playAgainstAI = false;
	let nextDepth = 5;
</script>

<div class="board-holder">
	{#if test.matches}
		<div class="marker-box">
			<img
				class="marker"
				src="/images/marker-{markerColor}.svg"
				alt="marker-{markerColor}"
				style:--show={showMarker}
			/>
		</div>
	{/if}
	<div class="board">
		<picture>
			<source srcset="/images/board-layer-white-large.svg" media={breakPoint} />
			<img
				class="board-front"
				src="/images/board-layer-white-small.svg"
				alt="board-front-layer"
				draggable="false"
			/>
		</picture>
		<picture>
			<source srcset="/images/board-layer-black-large.svg" media={breakPoint} />
			<img
				class="board-back"
				src="/images/board-layer-black-small.svg"
				alt="board-back-layer"
				draggable="false"
			/>
		</picture>

		<div class="board-grid">
			{#each $gameStore.board.table as row, j}
				{#each row as cell, i}
					<div
						class="cell column-{i}"
						id={"c" + j + i}
						on:click={() => {
							gameStore.playMove(i);
							if (playAgainstAI)
								setTimeout(() => {
									gameStore.playMove(getAIMove($gameStore, nextDepth));
								}, 500);
						}}
					>
						{#if cell != 2}
							<Piece
								depth={j}
								color={cell == 0 ? "red" : "yellow"}
								{breakPoint}
								win={$gameStore.winInfo.cells.includes(j + "," + i)}
							/>
						{/if}
					</div>
				{/each}
			{/each}
		</div>
	</div>
</div>

<!--
<div class="temp">
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
-->
<style>
	.temp {
		background: white;
		padding: 20px;
		margin-top: 15px;
		border-radius: 25px;
	}

	.board-holder {
		--currentCol: 0;
	}
	/*If Sass:
	@for $i from 1 through 6 {
		.board-holder:has(.column-#{$i}:hover) {
			--currentCol: #{$i};
		}
	}
	*/
	.board-holder:has(.column-1:hover) {
		--currentCol: 1;
	}
	.board-holder:has(.column-2:hover) {
		--currentCol: 2;
	}
	.board-holder:has(.column-3:hover) {
		--currentCol: 3;
	}
	.board-holder:has(.column-4:hover) {
		--currentCol: 4;
	}
	.board-holder:has(.column-5:hover) {
		--currentCol: 5;
	}
	.board-holder:has(.column-6:hover) {
		--currentCol: 6;
	}

	.marker-box {
		display: none;
	}
	.marker {
		--step: calc(13.92%);
		display: block;
		visibility: var(--show);
		margin-left: calc(33px + var(--step) * var(--currentCol));
		transition: margin-left 350ms;
	}

	@media (hover: hover) and (pointer: fine) {
		.marker-box {
			display: block;
		}
	}

	img {
		user-select: none;
	}

	.board {
		position: relative;
		margin-bottom: 5px;
	}

	.board-grid,
	.board-back {
		position: absolute;
		left: 0;
		top: 0;
	}
	.board-grid {
		width: 100%;
		height: 100%;
		display: grid;
		padding: 1.8% 1.25%;
		padding-bottom: 8%;
		box-sizing: border-box;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(6, 1fr);
	}
	.board-front {
		position: relative;
		z-index: 1;
		pointer-events: none;
	}

	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
