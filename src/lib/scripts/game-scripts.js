import { ROWS, COLUMNS } from "$scripts/settings.js";

export function getValidMoves(board) {
	let validMoves = board.depths.reduce((result, depth, i) => {
		if (depth >= 0) result = result.concat(i);
		return result;
	}, []);

	//the columns at the centers have a higher chance of being the moves with the highest value
	//so analyzing them first allows for more efficient alpha - beta pruning
	function sortHelper(a, b) {
		let center = (COLUMNS - 1) / 2;
		let answer = Math.abs(center - a) - Math.abs(center - b);
		//return answer;
		if (answer != 0) return answer;
		//if they have the same distance from the center, return a random one
		let randomFactor = Math.random() < 0.5 ? 1 : -1;
		return randomFactor;
		
	}
	
	return validMoves.sort(sortHelper);
}

export function didSomeoneWin(board) {
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
				return { player: winner, cells: [0, 1, 2, 3].map((i) => r + "," + (c + i)) };
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
				return { player: winner, cells: [0, 1, 2, 3].map((i) => r + i + "," + c) };
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
				return { player: winner, cells: [0, 1, 2, 3].map((i) => r + i + "," + (c + i)) };
			} else if (
				r >= ROWS - 3 &&
				winner == board.table[r - 1][c + 1] &&
				winner == board.table[r - 2][c + 2] &&
				winner == board.table[r - 3][c + 3]
			) {
				return { player: winner, cells: [0, 1, 2, 3].map((i) => r - i + "," + (c + i)) };
			}
		}
	}

	//nobody won
	return { player: 2, cells: []};
}
