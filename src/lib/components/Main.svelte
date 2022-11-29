<script>
	import {minimax, didSomeoneWin} from "$scripts/computer-ai.js";
	let gameBoard = {
		table: [
			[2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2],
		],
		depths: [5, 5, 5, 5, 5, 5, 5],
		currentPlayer: 0,
	};

	function resetTable() {
		gameBoard.table = gameBoard.table.map((row) => row.map(() => 2));
		gameBoard.depths = gameBoard.depths.map(() => 5);
		gameBoard.currentPlayer = 0;
	}

	function getValidMoves(board) {
		return board.depths.reduce((result, depth, i) => {
			if (depth >= 0) result = result.concat(i);
			return result;
		}, []);
	}

	function playerMove(board, move) {
		if (board.depths[move] >= 0) {
			board.table[board.depths[move]][move] = board.currentPlayer;
			board.depths[move]--;
			board.currentPlayer = 1 - board.currentPlayer;
		}
		return board;
	}

	/*test*/
	let fillIsRunning = false;

	function fillBoard() {
		if (fillIsRunning) return;
		fillIsRunning = true;
		if (gameBoard.table[ROWS-1].every((el)=>el==2)) {
			playerMove(gameBoard, 3)
		}
		let testInterval = setInterval(() => {
			let validMoves = getValidMoves(gameBoard);
			let winner = didSomeoneWin(gameBoard)
			if (validMoves.length <= 0 || winner>=0) {
				fillIsRunning = false;
				clearInterval(testInterval);
				if (winner>=0) {
					console.log("the winner is "+winner+"!")
				} else {
					console.log("it's a draw!")
				}
			} else {
				//let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
				let randomMove = minMaxedMove(5) //max 5, maybe 6
				gameBoard = playerMove(gameBoard, randomMove);
			}
		}, 250);
	}

	const ROWS = 6;
	const COLUMNS = 7;

	function minMaxedMove(algDepth) {
		return minimax(gameBoard, algDepth, null, null, gameBoard.currentPlayer).move;
	}
</script>

<svelte:head>
	<link rel="preload" as="image" href="/images/player-one.svg" />
	<link rel="preload" as="image" href="/images/player-two.svg" />
</svelte:head>

<main>
	<div>
		current player: <img
			src="/images/player-{gameBoard.currentPlayer ? 'two' : 'one'}.svg"
			alt="current-player"
		/>
	</div>
	<div id="game-table">
		{#each gameBoard.table as row,j}
			<div class="game-row">
				{#each row as cell, i}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="game-cell"
						on:click={() => {
							gameBoard = playerMove(gameBoard, i);
							//cell = (cell+1)%3
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
		<button on:click={resetTable}>reset game</button>
		<button on:click={fillBoard}>fill board</button>
	</div>
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
