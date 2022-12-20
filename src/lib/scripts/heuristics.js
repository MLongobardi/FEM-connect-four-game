import { ROWS, COLUMNS } from "$scripts/settings.js";

export const HEURISTIC_VALUES = {
	thrice: 5,
	enemyThrice: -5,
	twice: 2,
	enemyTwice: -2,
	centerMod: 1 / 3.8,
	easierToSee: 1.15,
	heightPenalty: 1.015,
};

//pit two AIs with different sets of heuristic values against themselves and see who wins more often
export const HEURISTIC_FIGHTER_ONE = {
	thrice: 3,
	enemyThrice: -5,
	twice: 2,
	enemyTwice: -2,
	centerMod: 1 / 10,
	verticalPenalty: 1,
	heightPenalty: 1,
};

export const HEURISTIC_FIGHTER_TWO = {
	thrice: 3,
	enemyThrice: -3,
	twice: 2,
	enemyTwice: -2,
	centerMod: 0,
	verticalPenalty: 1,
	heightPenalty: 1,
};

export function getBoardValue(board, player, hv = HEURISTIC_FIGHTER_ONE) {
	let value = 0;
	//I used Sets because they only allow for unique elements
	let winningCells = new Set();
	let losingCells = new Set();
	
	function handleResults(results) {
		if (results.missingCell !== null && results.missingCell.height == 0) {
			let newCell = [results.missingCell.row, results.missingCell.column];
			if (results.missingCell.winning) winningCells.add(newCell);
			else losingCells.add(newCell);
		}

		return results.value;
	}

	//find all possible 4 piece sections, run getSectionValue on them
	//check horizontal sections
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLUMNS - 3; c++) {
			let section = [board.table[r][c]];
			for (let i = 1; i <= 3; i++) {
				section = section.concat(board.table[r][c + i]);
			}
			value += handleResults(getSectionValue(section, player, "horizontal", r, c, board.depths, hv));
		}
	}

	//check vertical sections
	for (let c = 0; c < COLUMNS; c++) {
		for (let r = 0; r < ROWS - 3; r++) {
			let section = [board.table[r][c]];
			for (let i = 1; i <= 3; i++) {
				section = section.concat(board.table[r + i][c]);
			}
			value += handleResults(getSectionValue(section, player, "vertical", r, c, board.depths, hv));
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
			value += handleResults(getSectionValue(section, player, "diagonal", r, c, board.depths, hv));
		}
	}

	//having at least two different moves that can complete a section means winning
	//console.log(losingCells)
	if (winningCells.size >= 2) value += 200
	if (losingCells.size >= 2) value -= 200

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
				value += cellValues[r][c] * hv.centerMod;
			}
		}
	}

	return value;
}

function getSectionValue(section, player, direction, r, c, depths, hv) {
	//objects that counts how many instances of 0, 1 or 2 are in the section
	let counts = section.reduce((acc, curr) => {
		acc[curr] = (acc[curr] || 0) + 1;
		return acc;
	}, {});

	if (counts["2"] >= 3) return { value: 0, missingCell: null }; //ignore mostly empty sections
	if (counts["0"] >= 1 && counts["1"] >= 1) return { value: 0, missingCell: null }; //ignore mixed sections
	if (counts[player] == 4) return { value: 100000, missingCell: null }; //won
	if (counts[1 - player] == 4) return { value: -100000, missingCell: null }; //lost

	//set value base
	let value = 0;
	if (counts[player] == 3) value += hv.thrice;
	else if (counts[player] == 2) value += hv.twice;
	else if (counts[1 - player] == 3) value += hv.enemyThrice; //negative
	else if (counts[1 - player] == 2) value += hv.enemyTwice; //negative

	//value modifiers
	//vertical and horizontal directions are easier too see for a human player
	if (direction == "vertical" || direction == "horizontal") value /= hv.easierToSee;
	
	let missingCell = null;
	if (counts["2"] == 1) {
		missingCell = { row: r, column: c, height: 0, winning: value>=0 }; //stays this way if direction == "vertical"
		let i = section.indexOf(2);
		if (direction == "horizontal") {
			missingCell.column += i;
			missingCell.height = depths[missingCell.column] - missingCell.row;
		} else if (direction == "diagonal") {
			missingCell.row += r < ROWS - 3 ? i : -i;
			missingCell.column += i;
			missingCell.height = depths[missingCell.column] - missingCell.row;
		}

		value /= Math.pow(hv.heightPenalty, missingCell.height); //sections are less valuable the longer it takes to complete them
		missingCell.testInfo = { section: section, player: player, direction: direction, row: r, column: c, depths: depths }
	}
	
	return { value: value, missingCell: missingCell };
}
