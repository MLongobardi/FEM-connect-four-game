const ROWS = 6;
const COLUMNS = 7;

export function getValidMoves(board) {
	return board.depths.reduce((result, depth, i) => {
		if (depth >= 0) result = result.concat(i);
		return result;
	}, []);
}

export function didSomeoneWin(board) {
	//TODO
	//return object with r, c and direction to highlight winning section
	//check horizontal wins
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLUMNS - 3; c++) {
			let winner = board.table[r][c];
			if (winner >= 2) continue;
			if (
				winner == board.table[r][c + 1] &&
				winner == board.table[r][c + 2] &&
				winner == board.table[r][c + 3]
			) {
				board.winInfo = { player: winner, cells: [0, 1, 2, 3].map((i) => r+","+ (c + i)) };
				return winner;
			}
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
			) {
				board.winInfo = { player: winner, cells: [0, 1, 2, 3].map((i) => (r + i) + "," + c) };
				return winner;
			}
		}
	}

	//check diagonal wins
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLUMNS - 3; c++) {
			let winner = board.table[r][c];
			if (winner >= 2) continue;
			if (
				r < ROWS - 3 &&
				winner == board.table[r + 1][c + 1] &&
				winner == board.table[r + 2][c + 2] &&
				winner == board.table[r + 3][c + 3]
			) {
				board.winInfo = { player: winner, cells: [0, 1, 2, 3].map((i) => (r + i) + "," + (c + i)) };
				return winner;
			} else if (
				r >= ROWS - 3 &&
				winner == board.table[r - 1][c + 1] &&
				winner == board.table[r - 2][c + 2] &&
				winner == board.table[r - 3][c + 3]
			) {
				board.winInfo = { player: winner, cells: [0, 1, 2, 3].map((i) => (r - i) + "," + (c + i)) };
				return winner;
			}
		}
	}

	//nobody won
	return -1;
}
