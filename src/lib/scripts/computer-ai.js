import { MapWithMaxLength } from "$scripts/MapWithMaxLength";
import { getBoardValue } from "$scripts/heuristics";
import { getValidMoves, didSomeoneWin } from "$scripts/game-scripts.js";
const DEBUG = false;
const USE_CACHE = true;
const RANDOMIZE = false;
let AI = 0, SIMULATED_ADVERSARY = 1, useCacheOne = true;

const cacheOne = new MapWithMaxLength();
const cacheTwo = new MapWithMaxLength(); //two caches are needed when two AIs play against each other

export function getAIMove(state, algDepth, HEURISTIC_VALUES) {
	if (AI != state.currentPlayer) useCacheOne = !useCacheOne;
	AI = state.currentPlayer;
	SIMULATED_ADVERSARY = 1 - AI;
	if (algDepth <= 0) throw "depth must be at least 1!";
	if (RANDOMIZE && Math.random() < 0.05) {
		console.log("random move!");
		let m = getValidMoves(state.board);
		return m[Math.floor(Math.random() * m.length)];
	}
	return minimax(state.board, algDepth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, state.currentPlayer, 0, HEURISTIC_VALUES).move
}

function playMove(board, move, player) {
	board.table[board.depths[move]][move] = player;
	board.depths[move]--;
	return board;
}

function getBoardValueCache(board, HEURISTIC_VALUES) {
	if (!USE_CACHE) return getBoardValue(board, AI, HEURISTIC_VALUES);
	let boardKey = board.table.reduce((a, b) => a + b.join(""), "");
	if (useCacheOne) {
		//cacheOne has the value
		if (cacheOne.has(boardKey)) return cacheOne.get(boardKey);
		//cacheOne doesn't have the value
		let boardValue = getBoardValue(board, AI, HEURISTIC_VALUES);
		cacheOne.set(boardKey, boardValue);
		return boardValue;
	}
	//cacheTwo has the value
	if (cacheTwo.has(boardKey)) return cacheTwo.get(boardKey);
	//cacheTwo doesn't have the value
	let boardValue = getBoardValue(board, AI, HEURISTIC_VALUES);
	cacheTwo.set(boardKey, boardValue);
	return boardValue;
}

function minimax(board, depth, a, b, player, c = 0, HEURISTIC_VALUES) {
	//c argument is for debugging, HEURISTIC_VALUES is for testing which heuristic function is better, remove both when done
	let logIndent = "--".repeat(c);
	//if (c == 0) console.log(boardCache.size) 
	//base case
	let validMoves = getValidMoves(board); //ordered to improve alpha-beta pruning
	let winner = didSomeoneWin(board).player;

	if (winner != 2) {
		//someone won
		return { move: -1, value: getBoardValueCache(board, HEURISTIC_VALUES)};
	}

	if (validMoves.length == 0) {
		//draw
		return { move: -1, value: 0 };
	}

	if (depth == 0) {
		return { move: -1, value: getBoardValueCache(board, HEURISTIC_VALUES) };
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
			let results = minimax(boardCopy, depth - 1, a, b, SIMULATED_ADVERSARY, c + 1, HEURISTIC_VALUES); //boardCopy
			results.value *= 0.9999; //favor shorter games if winning, longer ones if losing
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
		if (DEBUG) console.log(logIndent, "chosenMove: ", thisIterationMove, "value: ", thisIterationValue);
		return { value: thisIterationValue, move: thisIterationMove };
	} else if (player == SIMULATED_ADVERSARY) {
		let thisIterationValue = Number.POSITIVE_INFINITY;
		let thisIterationMove = validMoves[0];
		if (DEBUG) console.log(logIndent, "player: ", player, "validMoves: ", validMoves);
		for (let i of validMoves) {
			if (DEBUG && depth != 1) console.log(logIndent, "examining move ", i);
			let boardCopy = JSON.parse(JSON.stringify(board)); //deep copy
			playMove(boardCopy, i, SIMULATED_ADVERSARY);
			let results = minimax(boardCopy, depth - 1, a, b, AI, c + 1, HEURISTIC_VALUES); //boardCopy
			results.value *= 0.9999; //favor shorter games if winning, longer ones if losing
			if (DEBUG) console.log(logIndent, "move: ", i, "moveValue: ", results.value);
			if (results.value < thisIterationValue) {
				thisIterationValue = results.value;
				thisIterationMove = i;
			}

			//alpha-beta pruning
			b = Math.min(b, thisIterationValue);
			if (b <= a) {
				if (DEBUG) console.log(logIndent, "pruned!", "a:", a, "b:", b);
				break;
			}
		}
		if (DEBUG)
			console.log(logIndent, "chosenMove: ", thisIterationMove, "value: ", thisIterationValue);
		return { value: thisIterationValue, move: thisIterationMove };
	}
}