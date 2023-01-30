<script>
	import { gameStore, mediaStore } from "$stores";
	import { mediaQueries } from "$lib/myConfig.js";
	import { getValidMoves } from "$scripts/game-scripts.js";
	import { getAIMove } from "$scripts/computer-ai.js";
	import { Piece } from "$comps";

	//consider using myConfig.js values, so it synchronizes with mediaStore
	const boardBreakPoint = mediaQueries.screen.tablet.substring(
		0,
		mediaQueries.screen.tablet.indexOf(")") + 1
	);
	let blockMoves = false;

	$: markerColor = $gameStore.currentPlayer == 0 ? "red" : "yellow";
	$: showMarker =
		$gameStore.gameOver || ($gameStore.currentPlayer == 1 && $gameStore.currentMode == "PVC")
			? "hidden"
			: "visible";
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

		<div
			class="board-grid"
			style:--hover-color={$gameStore.currentPlayer == 0 ? "var(--pink)" : "var(--yellow)"}
		>
			{#each $gameStore.board.table as row, j}
				{#each row as cell, i}
					<button
						disabled={blockMoves || !getValidMoves($gameStore.board).includes(i)}
						class="cell column-{i}"
						id={"c" + j + i}
						on:click={() => {
							if (!blockMoves) {
								blockMoves = true;
								gameStore.playMove(i);
								setTimeout(() => {
									if ($gameStore.currentMode == "PVC") {
										gameStore.playMove(getAIMove($gameStore, $gameStore.AIDepth));
										setTimeout(() => {
											blockMoves = false;
										}, 500);
									} else {
										blockMoves = false;
									}
								}, 600);
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
					</button>
				{/each}
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	@use "sass:math";
	$board-grid-horizontal-padding: 1.25%;

	.board-holder {
		--currentCol: 3;
		width: fit-content;
		margin: auto;
	}

	@for $i from 0 through 6 {
		.board-holder:has(.column-#{$i}:focus-visible):not(:has(.cell:hover)), .board-holder:has(.column-#{$i}:hover) {
			/*updates marker position on :hover, and also on :focus-visible if no cell is on :hover*/
			--currentCol: #{$i};
		}
	}

	.marker {
		$step: math.div(100% - 2 * $board-grid-horizontal-padding, 7); //width of a grid cell
		--initial: calc(
			#{math.div($step, 2) + $board-grid-horizontal-padding} - #{math.div(38px, 2)}
		); //38px is the width of the marker
		display: block;
		visibility: var(--show);
		margin-bottom: 1px;
		margin-left: calc(var(--initial) + $step * var(--currentCol));
		transition: margin-left 350ms;
	}

	img {
		max-width: 92vw;
		user-select: none;
	}

	.board {
		position: relative;
		margin-bottom: 5px;
	}
	.board-holder:not(:has(.marker-box)) .board {
		margin-top: 36px;
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
		padding: 1.8% $board-grid-horizontal-padding;
		padding-bottom: 8%;
		box-sizing: border-box;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(6, 1fr);
		border-radius: 50px;
		overflow: hidden; //with border-radius, hides corner cells' color on hover
	}
	.board-front {
		position: relative;
		z-index: 2;
		pointer-events: none;
	}

	.cell {
		/*reset button styles*/
		background: none;
		border: none;
		padding: 0;
		/*end reset*/
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 100ms;
	}
	:is(.cell:not([disabled]):hover, .board:not(:has(.cell:hover)) .cell:not([disabled]):focus-visible):not(:has(.piece)) {
		/*selects :hover cells, :focus-visible cells when no other one is :hover, but not disabled cells or already occupied cells */
		background: var(--hover-color);
		opacity: 0.8;
	}
</style>
