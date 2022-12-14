<script>
	import { getAIMove } from "$scripts/computer-ai.js";
	import { getValidMoves, didSomeoneWin } from "$scripts/game-scripts.js";
	import { getBoardValue, HEURISTIC_VALUES, HEURISTIC_FIGHTER_ONE, HEURISTIC_FIGHTER_TWO } from "$scripts/heuristics.js";

	let gameState = {
		board: {
			table: [
				[2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2],
				[2, 2, 2, 2, 2, 2, 2],
			],
			depths: [5, 5, 5, 5, 5, 5, 5],
			/*
			//test
			table: [
				[1, 2, 0, 0, 0, 2, 2],
				[0, 2, 1, 0, 1, 2, 2],
				[0, 2, 1, 1, 1, 2, 2],
				[1, 2, 1, 1, 0, 2, 2],
				[0, 2, 0, 0, 0, 1, 1],
				[1, 2, 1, 0, 0, 1, 0],
			],
			depths: [-1, 5, -1, -1, -1, 3, 3],
			*/
		},
		currentPlayer: 0,
		gameOver: false,
		winInfo: { player: 2, cells: [] },
		thisAIBattleInfo: {
			movedFirst: ""
		},
		tournamentArcResults: {
			//red moves first
			totalRuns: 0,
			red_one: 0, //fighter one moved first and won
			yellow_one: 0, //fighter one moved second and won
			red_two: 0, //fighter two moved first and won
			yellow_two: 0, //fighter two moved second and won
			draws: 0,
		},

		testPlayMove(move) {
			if (this.depths[move] >= 0 && !this.gameOver) {
				this.table[this.depths[move]][move] = this.currentPlayer;
				this.depths[move]--;
				this.currentPlayer = 1 - this.currentPlayer;
				//console.log(this)
			}
		},
	};
	
	let AIIsBattling = false;

	function didSomeoneWinWrapper(board) {
		let info = didSomeoneWin(board);
		gameState.winInfo = info;
		return info.player;
	}

	function resetGame() {
		gameState.board.table = gameState.board.table.map((row) => row.map(() => 2));
		gameState.board.depths = gameState.board.depths.map(() => 5);
		gameState.currentPlayer = 0;
		gameState.winInfo = { player: 2, cells: [] };
	}

	function playerMove(state, move) {
		if (state.board.depths[move] >= 0 && state.winInfo.player == 2) {
			state.board.table[state.board.depths[move]][move] = state.currentPlayer;
			state.board.depths[move]--;
			state.currentPlayer = 1 - state.currentPlayer;
			isGameOver();
			if (!AIIsBattling) {
				isGameOver();
				/*
				console.log("red score: " + getBoardValue(gameState.board, 0));
				console.log("yellow score: " + getBoardValue(gameState.board, 1));
				console.log("--------");
				*/
			}
		}
		return state;
	}
	
	function undoMove(board, move) {
		if (board.depths[move] < 5) {
			board.depths[move]++;
			board.table[board.depths[move]][move] = 2;
			board.currentPlayer = 1 - board.currentPlayer;
		}
	return board;
}

	/*test*/
	function isGameOver() {
		let winner = didSomeoneWinWrapper(gameState.board);
		gameState = gameState; //triggers reactivity
		if (getValidMoves(gameState.board) <= 0 || winner != 2) {
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

	//let AIIsBattling = false;
	let firstPlayer = 1;
	function tournamentArc() {
		if (AIIsBattling) return;
		resetGame();
		AIIsBattling = true;
		//let firstPlayer = Math.random() < 0.5 ? 1 : 0;
		firstPlayer = 1 - firstPlayer;
		if (firstPlayer == 0) {
			gameState.thisAIBattleInfo.movedFirst = "one";
		}
		else {
			gameState.thisAIBattleInfo.movedFirst = "two";
		};
		AIBattle(firstPlayer);
	}

	function stopBattle() {
		AIIsBattling = false;
		let winner = didSomeoneWinWrapper(gameState.board);
		if (winner==2) gameState.tournamentArcResults.draws++;
		else {
			let winnerColor = ["red","yellow"][winner];
			let movedFirst = gameState.thisAIBattleInfo.movedFirst;
			let x = winnerColor+"_"+movedFirst;
			gameState.tournamentArcResults[x]++
			console.log(x, "run " + gameState.tournamentArcResults.totalRuns)
		}
		gameState.tournamentArcResults.totalRuns++;
		if (gameState.tournamentArcResults.totalRuns <= tournamentRuns) tournamentArc();
		else console.log(gameState.tournamentArcResults)
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
			move = await getAIMove(gameState, 5, HEURISTIC_FIGHTER_ONE);
		} else if (number == 1) {
			//fighter two
			move = await getAIMove(gameState, 5, HEURISTIC_FIGHTER_TWO);
		}
		gameState = playerMove(gameState, move);
	}

	function testAlgTime(algDepth, times = 1, total = 0, count = 1) {
		//actually console.time() exists, so look into that
		if (times > 0) {
		console.log("calculating "+count+"...")
		let before = performance.now();
		playerMove(gameState, getAIMove(gameState, algDepth, HEURISTIC_VALUES));
		let after = performance.now();
		let time = after - before;
		console.log("depth: " + algDepth, "time: " + time + " ms");
		return testAlgTime(algDepth, times-1, total+time, count+1);
		}
		console.log("total: ", total + "ms")
		console.log("--------------------")
	}
	//testAlgTime(6,30);

	let checked = false;
	let nextDepth = 7;
	let tournamentRuns = 299;
</script>

<svelte:head>
	<link rel="preload" as="image" href="/images/player-one.svg" />
	<link rel="preload" as="image" href="/images/player-two.svg" />
</svelte:head>
<main>
	<div>
		current player: <img
			src="/images/player-{gameState.currentPlayer ? 'two' : 'one'}.svg"
			alt="current-player"
		/>
	</div>
	
	<div id="game-table">
		{#each gameState.board.table as row, j}
			<div class="game-row">
				{#each row as cell, i}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="game-cell"
						id="cell-{[j, i]}"
						style:background={gameState.winInfo.cells.includes(j + "," + i) ? "lightgreen" : "none"}
						on:click={() => {
							gameState = playerMove(gameState, i);
							if (checked)
								setTimeout(() => {
									gameState = playerMove(gameState, getAIMove(gameState, nextDepth, HEURISTIC_VALUES));
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
				gameState = playerMove(gameState, getAIMove(gameState, nextDepth, HEURISTIC_VALUES));
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
