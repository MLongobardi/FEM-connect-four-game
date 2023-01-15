<script>
	import { gameStore, mediaStore } from "$stores";
	import { getAIMove } from "$scripts/computer-ai.js";
	import { Piece } from "$comps";

	//consider using myConfig.js values, so it synchronizes with mediaStore
	const boardBreakPoint = "(min-width: 670px)";
	let blockMoves = false;

	$: markerColor = $gameStore.currentPlayer == 0 ? "red" : "yellow";
	$: showMarker = $gameStore.gameOver || ($gameStore.currentPlayer == 1 && $gameStore.currentMode == "PVC") ? "hidden" : "visible";
</script>

<div class="board-holder">
	{#if $mediaStore.misc.hoverable}
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
			<source srcset="/images/board-layer-white-large.svg" media={boardBreakPoint} />
			<img
				class="board-front"
				src="/images/board-layer-white-small.svg"
				alt="board-front-layer"
				draggable="false"
			/>
		</picture>
		<picture>
			<source srcset="/images/board-layer-black-large.svg" media={boardBreakPoint} />
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
							if (!blockMoves) {
								blockMoves = true;
								gameStore.playMove(i);
								if ($gameStore.currentMode == "PVC") {
									setTimeout(() => {
										gameStore.playMove(getAIMove($gameStore, $gameStore.AIDepth));
										blockMoves = false;
									}, 500);
								} else {
									blockMoves = false;
								}
							}
						}}
					>
						{#if cell != 2}
							<Piece
								depth={j}
								color={cell == 0 ? "red" : "yellow"}
								breakPoint={boardBreakPoint}
								win={$gameStore.winInfo.cells.includes(j + "," + i)}
							/>
						{/if}
					</div>
				{/each}
			{/each}
		</div>
	</div>
</div>

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

	.marker {
		--step: calc(13.92%);
		display: block;
		visibility: var(--show);
		margin-left: calc(33px + var(--step) * var(--currentCol));
		transition: margin-left 350ms;
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
		z-index: 1;
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
		z-index: 2;
		pointer-events: none;
	}

	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
