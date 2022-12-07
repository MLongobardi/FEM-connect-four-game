import { getBoardValue } from "$scripts/heuristics";
import { getValidMoves, didSomeoneWin } from "$scripts/game-scripts.js";
const DEBUG = false;
const USE_CACHE = true;
let AI = 1, PLAYER = 0;

export function getAIMove(state, algDepth, HEURISTIC_VALUES) {
	AI = state.currentPlayer;
	PLAYER = 1 - AI;
	if (algDepth <= 0) throw "depth must be at least 1!";
	return minimax(state.board, algDepth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, state.currentPlayer, 0, HEURISTIC_VALUES).move
}

const boardCache = new Map();
//works, but there's 74,088 possible boards in Connect 4, maybe there could be a memory issue after enough games.
//if needed, change this from a Map to something like this:
/*
const boardCache = {
	cache: {},
	cacheLength = 0,
	maxSize: ???
	set(key,value) {
		if (cacheLength >= maxSize) {
			delete cache[Object.keys(cache)[0]]
			cacheLength--;
		}

		cache[key] = value
		cacheLength++
	},
	get(key) {return this.cache[key]},
}
*/

function playMove(board, move, currentPlayer) {
	board.table[board.depths[move]][move] = currentPlayer;
	board.depths[move]--;
	return board;
}

function minimax(board, depth, a, b, player, c = 0, HEURISTIC_VALUES) {
	let logIndent = "--".repeat(c);
	//if (c == 1) console.log(boardCache) 
	//base case
	let validMoves = getValidMoves(board); //ordered to improve alpha-beta pruning
	let winner = didSomeoneWin(board).player;

	if (winner != 2) {
		//someone won
		if (winner == AI) return { move: -1, value: 10000000 };
		else return { move: -1, value: -10000000 };
	}

	if (validMoves.length == 0) {
		//draw
		return { move: -1, value: 0 };
	}

	if (depth == 0) {
		if (USE_CACHE) {
			let boardKey = board.table.reduce((a, b) => a + b.join(""), "");
			let boardValue = boardCache.get(boardKey);
			if (!boardValue) {
				boardValue = getBoardValue(board, AI, HEURISTIC_VALUES);
				boardCache.set(boardKey, boardValue);
			}
			return { move: -1, value: boardValue };
		} else return { move: -1, value: getBoardValue(board, AI, HEURISTIC_VALUES) };
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
			let results = minimax(boardCopy, depth - 1, a, b, PLAYER, c + 1, HEURISTIC_VALUES); //boardCopy
			results.value -= 0.0001; //if two end states have the same value, favor the one that takes less moves
			if (DEBUG) console.log(logIndent, "move: ", i, "moveValue: ", results.value);
			if (results.value > thisIterationValue) {
				thisIterationValue = results.value;
				thisIterationMove = i;
			}

			//alpha-beta pruning
			a = Math.max(a, thisIterationValue);
			if (a >= b) {
				if (DEBUG) console.log(logIndent, "pruned!", "a:", a, "b:", b);
				break;
			}
		}
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
			let results = minimax(boardCopy, depth - 1, a, b, AI, c + 1, HEURISTIC_VALUES); //boardCopy
			results.value -= 0.0001; //if two end states have the same value, favor the one that takes less moves
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
		if (DEBUG) console.log(logIndent, "chosenMove: ", thisIterationMove, "value: ", thisIterationValue);
		return { value: thisIterationValue, move: thisIterationMove };
	}
}