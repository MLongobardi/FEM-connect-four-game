import { ROWS, COLUMNS } from "$scripts/settings.js"

//TODO
//pit two AIs with different sets of heuristic values against themselves and see who wins more often
const HEURISTIC_VALUES = {
	thrice: 3,
	twice: 2,
	centerMod: 10,
	verticalPenalty: 1.1,
	heightPenalty: 1.15,
};

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
	let counts = section.reduce((acc, curr) => {
		acc[curr] = (acc[curr] || 0) + 1;
		return acc;
	}, {});

	if (counts["2"] >= 3) return 0;
	if (counts[player] >= 1 && counts[1 - player] >= 1) return 0;
	if (counts[player] == 4) return 1000;
	if (counts[1 - player] == 4) return -1000;

	if (counts[player] == 3 && counts["2"] == 1) value += HEURISTIC_VALUES.thrice;
	else if (counts[player] == 2 && counts["2"] == 2) value += HEURISTIC_VALUES.twice;
	else if (counts[1 - player] == 3 && counts["2"] == 1) value -= HEURISTIC_VALUES.thrice;

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
			if (height == 0 && board.currentPlayer == player && counts["2"] == 1) {
				//win next move
				value *= 10;
			} else if (height > 0 && height % 2 == 1 - player) {
				//penalty based on the number of empty cells under missing cell(s) in the section, unless that number is even
				value /= Math.pow(HEURISTIC_VALUES.heightPenalty, height);
			}
		}
	}
    
	//if (value > 0) console.log(section, r, c, direction, value);
	return value;
}
