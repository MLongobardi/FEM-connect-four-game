<script>
	import { getAIMove } from "$scripts/computer-ai.js";
	import { getValidMoves, didSomeoneWin } from "$scripts/game-scripts.js";
	import { getBoardValue, HEURISTIC_VALUES, HEURISTIC_FIGHTER_ONE, HEURISTIC_FIGHTER_TWO } from "$scripts/heuristics.js";
	
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
		winInfo: { player: 2, cells: [] },
		thisAIBattleInfo: {
			movedFirst: ""
		},
		tournamentArcResults: {
			totalRuns: 0,
			red_one: 0, //fighter one moved first
			yellow_one: 0, //fighter one moved second
			red_two: 0, //fighter two moved first
			yellow_two: 0, //fighter two moved second
			draws: 0,
		},
	};

	function resetGame() {
		gameBoard.table = gameBoard.table.map((row) => row.map(() => 2));
		gameBoard.depths = gameBoard.depths.map(() => 5);
		gameBoard.currentPlayer = 0;
		gameBoard.winInfo = { player: 2, cells: [] };
	}

	function playerMove(board, move) {
		if (board.depths[move] >= 0 && board.winInfo.player == 2) {
			board.table[board.depths[move]][move] = board.currentPlayer;
			board.depths[move]--;
			board.currentPlayer = 1 - board.currentPlayer;
			isGameOver();
			if (!AIIsBattling) {
				isGameOver();
				/*
				console.log("red score: " + getBoardValue(board, 0));
				console.log("yellow score: " + getBoardValue(board, 1));
				console.log("--------");
				*/
			}
		}
		return board;
	}

	/*test*/
	function isGameOver() {
		let winner = didSomeoneWin(gameBoard);
		gameBoard = gameBoard; //triggers reactivity
		if (getValidMoves(gameBoard) <= 0 || winner >= 0) {
			if (AIIsBattling) return true;
			if (winner == 0) {
				console.log("winner is red!");
			} else if (winner == 1) {
				console.log("winner is yellow!");
			} else {
				console.log("it's a draw!");
			}
			return true;
		}
		return false;
	}

	let AIIsBattling = false;
	
	function tournamentArc() {
		if (AIIsBattling) return;
		resetGame();
		AIIsBattling = true;
		let firstPlayer = Math.random() < 0.5 ? 1 : 0;
		if (firstPlayer == 0) {
			gameBoard.thisAIBattleInfo.movedFirst = "one";
		}
		else {
			gameBoard.thisAIBattleInfo.movedFirst = "two";
		};
		AIBattle(firstPlayer);
	}

	function stopBattle() {
		AIIsBattling = false;
		let winner = didSomeoneWin(gameBoard);
		if (winner<0) gameBoard.tournamentArcResults.draws++;
		else {
			let winnerColor = ["red","yellow"][winner];
			let movedFirst = gameBoard.thisAIBattleInfo.movedFirst;
			let x = winnerColor+"_"+movedFirst;
			gameBoard.tournamentArcResults[x]++
			console.log(x, "run " + gameBoard.tournamentArcResults.totalRuns)
		}
		gameBoard.tournamentArcResults.totalRuns++;
		if (gameBoard.tournamentArcResults.totalRuns <= tournamentRuns) tournamentArc();
		else console.log(gameBoard.tournamentArcResults)
	}

	function AIBattle(order) {
		if (isGameOver()) return stopBattle();

		fighter(order).then(() => {
			if (isGameOver()) return stopBattle();
			fighter(1 - order).then(() => {
				AIBattle(order);
			});
		});
	}
	
	async function fighter(number = 0) {
		let move = -1;
		if (number == 0) {
			//fighter one
			move = await getAIMove(gameBoard, 5, HEURISTIC_FIGHTER_ONE);
		} else if (number == 1) {
			//fighter two
			move = await getAIMove(gameBoard, 5, HEURISTIC_FIGHTER_TWO);
		}
		gameBoard = playerMove(gameBoard, move);
	}

	function testAlgTime(algDepth) {
		console.log("calculating...")
		let before = Date.now();
		getAIMove(gameBoard, algDepth, HEURISTIC_VALUES);
		let after = Date.now();
		console.log("depth: " + algDepth, "time: " + (after - before) + " ms");
	}

	let checked = false;
	let nextDepth = 4;
	let tournamentRuns = 20;
	//testAlgTime(7);
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
		{#each gameBoard.table as row, j}
			<div class="game-row">
				{#each row as cell, i}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="game-cell"
						id="cell-{[j, i]}"
						style:background={gameBoard.winInfo.cells.includes(j + "," + i) ? "lightgreen" : "none"}
						on:click={() => {
							gameBoard = playerMove(gameBoard, i);
							if (checked)
								setTimeout(() => {
									gameBoard = playerMove(gameBoard, getAIMove(gameBoard, nextDepth, HEURISTIC_VALUES));
								}, 100);

							//cell = (cell+1)%3;
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
		<button on:click={resetGame}>reset game</button>
		<span style="display: inline-flex; flex-direction: column">
			<button on:click={tournamentArc}>AI tournament arc</button>
			<label><input type="number" bind:value={tournamentRuns} min=1 max=1000>runs</label>
		</span>
		<button
			on:click={() => {
				gameBoard = playerMove(gameBoard, getAIMove(gameBoard, nextDepth, HEURISTIC_VALUES));
				//nextDepth = 10 - nextDepth //inverts 4 and 6
			}}>ai move</button
		>
		<label><input type="checkbox" bind:checked />play against ai</label>
		<label><input type="number" bind:value={nextDepth} min=1 max=7> ai difficulty</label>
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
