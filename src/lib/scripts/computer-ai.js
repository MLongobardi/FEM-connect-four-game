/*
let testBoard = {
	table: [
		[2, 2, 2, 2, 2, 2, 2],
		[2, 2, 2, 2, 2, 2, 2],
		[2, 2, 2, 2, 2, 2, 2],
		[2, 2, 2, 2, 2, 2, 2],
		[2, 2, 2, 2, 2, 2, 2],
		[2, 2, 2, 2, 2, 2, 2],
	],
	depths: [5, 5, 5, 5, 5, 5, 5],
};
*/
const AI = 1;
const PLAYER = 0;
const ROWS = 6;
const COLUMNS = 7;

function getValidMoves(board) {
	return board.depths.reduce((result, depth, i) => {
		if (depth >= 0) result = result.concat(i);
		return result;
	}, []);
}

function playMove(board, move, currentPlayer) {
	board.table[board.depths[move]][move] = currentPlayer;
	board.depths[move]--;
	return board;
}

export function minimax(board, depth, a, b, player) {
	//base case
	let validMoves = getValidMoves(board);
	let winner = didSomeoneWin(board);

	if (winner >= 0) {
		//someone won
		if (winner == AI) return { move: -1, value: Number.POSITIVE_INFINITY };
		else return { move: -1, value: Number.NEGATIVE_INFINITY };
	}
	
	if (validMoves.length == 0) {
		//draw
		return { move: -1, value: 0 };
	}
	if (depth == 0) {
		//calculate value depending on board state
		return { move: -1, value: 10 };
	}

	//recursion
	if (player == AI) {
		let thisIterationValue = Number.NEGATIVE_INFINITY;
		let thisIterationMove = -1;
		for (let i of validMoves) {
			let boardCopy = JSON.parse(JSON.stringify(board)); //deep copy
			playMove(boardCopy, i, AI);
			let results = minimax(boardCopy, depth - 1, a, b, PLAYER);
			if (thisIterationMove == -1) thisIterationMove = results.move; //maybe change results.move with i
			if (results.value > thisIterationValue) {
				thisIterationValue = results.value;
				thisIterationMove = i;
			}
			//alpha-beta stuff here
		}
		return { value: thisIterationValue, move: thisIterationMove };
	} else if (player == PLAYER) {
		let thisIterationValue = Number.POSITIVE_INFINITY;
		let thisIterationMove = -1;
		for (let i of validMoves) {
			let boardCopy = JSON.parse(JSON.stringify(board)); //deep copy
			playMove(boardCopy, i, PLAYER);
			let results = minimax(boardCopy, depth - 1, a, b, AI);
			if (thisIterationMove == -1) thisIterationMove = results.move;
			if (results.value < thisIterationValue) {
				thisIterationValue = results.value;
				thisIterationMove = i;
			}
			//alpha-beta stuff here
		}
		return { value: thisIterationValue, move: thisIterationMove };
	}
}

export function didSomeoneWin(board) {
	//check horizontal wins
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLUMNS - 3; c++) {
			let winner = board.table[r][c];
			if (winner >= 2) break;
			if (
				winner == board.table[r][c + 1] &&
				winner == board.table[r][c + 2] &&
				winner == board.table[r][c + 3]
			)
				return winner;
		}
	}

	//check vertical wins
	for (let c = 0; c < COLUMNS; c++) {
		for (let r = 0; r < ROWS - 3; r++) {
			let winner = board.table[r][c];
			if (winner >= 2) continue;
			if (
				winner == board.table[r + 1][c] &&
				winner == board.table[r + 2][c] &&
				winner == board.table[r + 3][c]
			)
				return winner;
		}
	}

	//check diagonal wins
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLUMNS - 3; c++) {
			let winner = board.table[r][c];
			if (winner >= 2) continue;
			if (
				(r < ROWS - 3 &&
					winner == board.table[r + 1][c + 1] &&
					winner == board.table[r + 2][c + 2] &&
					winner == board.table[r + 3][c + 3]) ||
				(r >= ROWS - 3 &&
					winner == board.table[r - 1][c + 1] &&
					winner == board.table[r - 2][c + 2] &&
					winner == board.table[r - 3][c + 3])
			)
				return winner;
		}
	}

	//nobody won
	return -1;
}
