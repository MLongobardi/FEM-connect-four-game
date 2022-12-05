import { getBoardValue } from "$scripts/heuristics";
import { getValidMoves, didSomeoneWin } from "$scripts/game-scripts.js";
const DEBUG = false;
let AI = 1, PLAYER = 0;

export function getAIMove(board, algDepth, HEURISTIC_VALUES) {
	AI = board.currentPlayer;
	PLAYER = 1 - AI;
	if (algDepth > 0)
		return minimax(
			board,
			algDepth,
			Number.NEGATIVE_INFINITY,
			Number.POSITIVE_INFINITY,
			board.currentPlayer,
			0,
			HEURISTIC_VALUES
		).move;
	throw "depth must be at least 1!";
}

//const AI = 1; //maybe rename to yellow
//const PLAYER = 0; //red

function playMove(board, move, currentPlayer) {
	board.table[board.depths[move]][move] = currentPlayer;
	board.depths[move]--;
	//board.currentPlayer = 1 - currentPlayer;
	return board;
}

function minimax(board, depth, a, b, player, c = 0, HEURISTIC_VALUES) {
	let logIndent = "--".repeat(c);
	//player = board.currentPlayer;
	
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
		return { move: -1, value: getBoardValue(board, AI, HEURISTIC_VALUES) };
	}

	//recursion
	if (player == AI) {
		let thisIterationValue = Number.NEGATIVE_INFINITY;
		let thisIterationMove = validMoves[0];
		if (DEBUG) console.log(logIndent, "player: ", player, "validMoves: ", validMoves);
		for (let i of validMoves) {
			if (DEBUG && depth != 1) console.log(logIndent, "examining move ", i);
			let boardCopy = JSON.parse(JSON.stringify(board)); //deep copy
			playMove(boardCopy, i, AI);
			let results = minimax(boardCopy, depth - 1, a, b, PLAYER, c + 1, HEURISTIC_VALUES);
			results.value -= 0.0001; //if two end states have the same value, favors the one that takes less moves
			if (DEBUG) console.log(logIndent, "move: ", i, "moveValue: ", results.value);
			if (results.value > thisIterationValue) {
				thisIterationValue = results.value;
				thisIterationMove = i;
			}

			//alpha-beta pruning
			a = Math.max(a, thisIterationValue);
			if (a >= b) {
				if (DEBUG) console.log(logIndent, "pruned");
				break;
			}
		}
		//thisIterationValue += 0.0001;
		if (DEBUG)
			console.log(logIndent, "chosenMove: ", thisIterationMove, "value: ", thisIterationValue);
		return { value: thisIterationValue, move: thisIterationMove };
	} else if (player == PLAYER) {
		let thisIterationValue = Number.POSITIVE_INFINITY;
		let thisIterationMove = validMoves[0];
		if (DEBUG) console.log(logIndent, "player: ", player, "validMoves: ", validMoves);
		for (let i of validMoves) {
			if (DEBUG && depth != 1) console.log(logIndent, "examining move ", i);
			let boardCopy = JSON.parse(JSON.stringify(board)); //deep copy
			playMove(boardCopy, i, PLAYER);
			let results = minimax(boardCopy, depth - 1, a, b, AI, c + 1, HEURISTIC_VALUES);
			results.value -= 0.0001; ////if two end states have the same value, favors the one that takes less moves
			if (DEBUG) console.log(logIndent, "move: ", i, "moveValue: ", results.value);
			if (results.value < thisIterationValue) {
				thisIterationValue = results.value;
				thisIterationMove = i;
			}
			
			//alpha-beta pruning
			b = Math.min(b, thisIterationValue)
			if (b <= a) {
				if (DEBUG) console.log(logIndent, "pruned!", "a:", a, "b:", b);
				break;
			}
		}
		//thisIterationValue += 0.0001;
		if (DEBUG)
			console.log(logIndent, "chosenMove: ", thisIterationMove, "value: ", thisIterationValue);
		return { value: thisIterationValue, move: thisIterationMove };
	}
}