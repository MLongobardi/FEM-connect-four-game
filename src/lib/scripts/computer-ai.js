export function getAIMove(board, algDepth) {
	return minimax(board, algDepth, null, null, board.currentPlayer).move;
}

const AI = 1;
const PLAYER = 0;
const ROWS = 6;
const COLUMNS = 7;
//TODO
//pit two AIs with different sets of heuristic values against themselves and see who wins more often
const HEURISTIC_VALUES = {
	thrice: 3,
	twice: 2,
	centerMod: 10,
	verticalPenalty: 1.1,
	heightPenalty: 1.2,
};

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
	let validMoves = getValidMoves(board); //maybe randomize validMoves before iterating through it?
	let winner = didSomeoneWin(board);

	if (winner >= 0) {
		//someone won
		if (winner == AI) return { move: -1, value: 10000000 };
		else return { move: -1, value: -10000000 };
	}

	if (validMoves.length == 0) {
		//draw
		return { move: -1, value: 0 };
	}

	if (depth == 0) {
		return { move: -1, value: getBoardValue(board, AI) }; //why does it work with AI instead of the "player" variable?? shouldn't it return the value from the point of view of the current player??
	}

	//recursion
	if (player == AI) {
		let thisIterationValue = Number.NEGATIVE_INFINITY;
		let thisIterationMove = validMoves[0];
		for (let i of validMoves) {
			let boardCopy = JSON.parse(JSON.stringify(board)); //deep copy
			playMove(boardCopy, i, AI);
			let results = minimax(boardCopy, depth - 1, a, b, PLAYER);
			if (results.value > thisIterationValue) {
				thisIterationValue = results.value;
				thisIterationMove = i;
			}
			//TODO
			//alpha-beta stuff here
		}
		return { value: thisIterationValue, move: thisIterationMove };
	} else if (player == PLAYER) {
		let thisIterationValue = Number.POSITIVE_INFINITY;
		let thisIterationMove = validMoves[0];
		for (let i of validMoves) {
			let boardCopy = JSON.parse(JSON.stringify(board)); //deep copy
			playMove(boardCopy, i, PLAYER);
			let results = minimax(boardCopy, depth - 1, a, b, AI);
			if (results.value < thisIterationValue) {
				thisIterationValue = results.value;
				thisIterationMove = i;
			}
			//TODO
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

export function getBoardValue(board, player) {
	let value = 0;
	//TODO
	//having more good sections should give more points. Maybe have a variable increase every time getSectionValue returns a value higher than 0, and either add it (multiply?) to the final result. Could interact weirdly when the result is negative though

	//find all possible 4 piece sections, run getSectionValue on them
	//check horizontal sections
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLUMNS - 3; c++) {
			let section = [board.table[r][c]];
			for (let i = 1; i <= 3; i++) {
				section = section.concat(board.table[r][c + i]);
			}
			value += getSectionValue(section, player, "horizontal", r, c, board);
		}
	}

	//check vertical sections
	for (let c = 0; c < COLUMNS; c++) {
		for (let r = 0; r < ROWS - 3; r++) {
			let section = [board.table[r][c]];
			for (let i = 1; i <= 3; i++) {
				section = section.concat(board.table[r + i][c]);
			}
			value += getSectionValue(section, player, "vertical", r, c, board);
		}
	}

	//check diagonal sections
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLUMNS - 3; c++) {
			let section = [board.table[r][c]];
			for (let i = 1; i <= 3; i++) {
				if (r < ROWS - 3) {
					section = section.concat(board.table[r + i][c + i]);
				} else {
					section = section.concat(board.table[r - i][c + i]);
				}
			}
			value += getSectionValue(section, player, "diagonal", r, c, board);
		}
	}

	//cells in the center have higher value
	//each number represents the number of sections that use that cell (reduced by 3, the minimum value)
	let cellValues = [
		[0, 1, 2, 4, 2, 1, 0],
		[1, 3, 5, 7, 5, 3, 1],
		[2, 5, 8, 10, 8, 5, 2],
		[2, 5, 8, 10, 8, 5, 2],
		[1, 3, 5, 7, 5, 3, 1],
		[0, 1, 2, 4, 2, 1, 0],
	];

	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < ROWS; c++) {
			if (board.table[r][c] == player) {
				value += cellValues[r][c] / HEURISTIC_VALUES.centerMod;
			}
		}
	}

	return value;
}

function getSectionValue(section, player, direction, r, c, board) {
	let value = 0;
	let sectionCounts = section.reduce((acc, curr) => {
		acc[curr] = (acc[curr] || 0) + 1;
		return acc;
	}, {});

	if (sectionCounts["2"] >= 3) return value;

	if (sectionCounts[player] == 3 && sectionCounts["2"] == 1) value += HEURISTIC_VALUES.thrice;
	else if (sectionCounts[player] == 2 && sectionCounts["2"] == 2) value += HEURISTIC_VALUES.twice;
	else if (sectionCounts[1 - player] == 3 && sectionCounts["2"] == 1)
		value -= HEURISTIC_VALUES.thrice;

	if (direction == "vertical") {
		//vertical sections are easier to see and counter
		value /= HEURISTIC_VALUES.verticalPenalty;
	} else {
		for (let i = 0; i <= 3; i++) {
			if (section[i] != 2) continue;
			let height;
			if (direction == "horizontal") {
				height = board.depths[c + i] - r;
			} else {
				//diagonal
				if (r < ROWS - 3) {
					height = board.depths[c + i] - (r + i);
				} else {
					height = board.depths[c + i] - (r - i);
				}
			}
			if (height % 2 == 1) {
				//penalty based on the number of empty cells under missing cell(s) in the section, unless that number is even
				value /= height * HEURISTIC_VALUES.heightPenalty;
			}
		}
	}

	return value;
}
