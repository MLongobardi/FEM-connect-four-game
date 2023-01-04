<script>
    import {gameStore} from "$scripts/store.js";

	let largeOrSmall = "large";
</script>

<div class="board">
    <img class="board-cover" src="/images/board-layer-white-{largeOrSmall}.svg" alt="board-front-layer-{largeOrSmall}" draggable="false" />
	<img class="board-back" src="/images/board-layer-black-{largeOrSmall}.svg" alt="board-back-layer-{largeOrSmall}" draggable="false" />
	<div class="board-grid">
        {#each $gameStore.board.table as row, j}
            {#each row as cell, i}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="cell" on:click|capture={()=>{gameStore.playMove(i)}}>
                        {#if cell != 2}
                            {@const color = cell == 0 ? "red" : "yellow"}
                            <img class="piece" style:--pos={j+1} src="images/counter-{color}-{largeOrSmall}.svg" alt="counter-{color}-{largeOrSmall}" draggable="false"/>
                        {/if}
                    </div>
                
            {/each}
        {/each}
    </div>
</div>

<style>
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
        /*padding: 15px;*/
        /*gap: 20px;*/
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

    .piece {
        --drop-duration: 0.3s;
        --bounce-duration: 0.3s;
        animation-name: drop, bounce;
        /*animation-duration: calc(100ms * var(--pos));*/
        animation-duration: var(--drop-duration), var(--bounce-duration);
        animation-timing-function: cubic-bezier(.5, 0.05, 1, .5), ease;
        animation-delay: 0s, calc(var(--drop-duration));
        animation-iteration-count: 1, 1;
    }

    @keyframes drop {
        from { transform: translateY(calc(var(--pos) * 117% * -1)) }
        to { transform: none }
    }
    
    @keyframes bounce {
        0% { transform: translateY(0%) }
        33% { transform: translateY(-25%) }
        67% { transform: translateY(0%) }
        83% { transform: translateY(-10%) }
        92% { transform: translateY(0%) }
        96% { transform: translateY(-3%) }
        100% { transform: translateY(0) }
    }
</style>
