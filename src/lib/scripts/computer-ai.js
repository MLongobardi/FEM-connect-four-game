import { getBoardValue } from "$scripts/heuristics";
import { getValidMoves, didSomeoneWin } from "$scripts/game-scripts.js";

export function getAIMove(board, algDepth) {
	if (algDepth > 0)
		return minimax(board, algDepth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, board.currentPlayer).move;
	throw "depth must be at least 1!";
}

const AI = 1; //maybe rename to yellow
const PLAYER = 0; //red

function playMove(board, move, currentPlayer) {
	board.table[board.depths[move]][move] = currentPlayer;
	board.depths[move]--;
	return board;
}

function minimax(board, depth, a, b, player) {
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

			//alpha-beta pruning
			a = Math.max(a, thisIterationValue);
			if (a >= b) break;
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
			
			//alpha-beta pruning
			b = Math.min(b, thisIterationValue)
			if (b <= a) break;
		}
		return { value: thisIterationValue, move: thisIterationMove };
	}
}