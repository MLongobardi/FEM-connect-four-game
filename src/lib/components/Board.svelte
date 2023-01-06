<script>
    import { gameStore } from "$scripts/store.js";
    import { getAIMove } from "$scripts/computer-ai.js";
    import { Piece } from "$comps"

	let largeOrSmall = "large";
    let playAgainstAI = false;
	let nextDepth = 5;
</script>

<div class="board">
    <img class="board-cover" src="/images/board-layer-white-{largeOrSmall}.svg" alt="board-front-layer-{largeOrSmall}" draggable="false" />
	<img class="board-back" src="/images/board-layer-black-{largeOrSmall}.svg" alt="board-back-layer-{largeOrSmall}" draggable="false" />
	<div class="board-grid">
        {#each $gameStore.board.table as row, j}
            {#each row as cell, i}
                <div class="cell" id={"c" + j + i} on:click={()=>{
                    gameStore.playMove(i)
                    if (playAgainstAI) setTimeout(() => {
						gameStore.playMove(getAIMove($gameStore, nextDepth));
					}, 500);
                }}>
                    {#if cell != 2}
                        <Piece depth={j} color={cell == 0 ? "red" : "yellow"} size={largeOrSmall} win={$gameStore.winInfo.cells.includes(j + "," + i)}/>
                    {/if}
                </div>
            {/each}
        {/each}
    </div>
</div>

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

<style>
    .temp {
        background: white;
        padding: 20px;
        margin-top: 15px;
        border-radius: 25px;
    }

    img {
        user-select: none;
    }

	.board {
		position: relative;
        margin-bottom: 5px;
	}

	.board-grid, .board-back {
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
		z-index: 1;
	}
	.board-cover {
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
