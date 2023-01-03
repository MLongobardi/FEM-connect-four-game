import { MapWithMaxLength } from "$scripts/MapWithMaxLength";
import { getBoardValue } from "$scripts/heuristics";
import { getValidMoves, didSomeoneWin } from "$scripts/game-scripts.js";
const USE_CACHE = true;
const RANDOMIZE = false;
let AI = 0;
let SIMULATED_ADVERSARY = 1;
let	useCacheOne = true;

const cacheOne = new MapWithMaxLength();
const cacheTwo = new MapWithMaxLength(); //two caches are needed when two AIs play against each other

export function getAIMove(store, algDepth) {
	if (AI != store.currentPlayer) useCacheOne = !useCacheOne;
	AI = store.currentPlayer;
	SIMULATED_ADVERSARY = 1 - AI;
	if (algDepth <= 0) throw "depth must be at least 1!";
	if (RANDOMIZE && Math.random() < 0.05) {
		console.log("random move!");
		let m = getValidMoves(store.board);
		return m[Math.floor(Math.random() * m.length)];
	}
	return minimax(
		store.board,
		algDepth,
		Number.NEGATIVE_INFINITY,
		Number.POSITIVE_INFINITY,
		store.currentPlayer
	).move;
}

function playMove(board, move, player) {
	board.table[board.depths[move]][move] = player;
	board.depths[move]--;
	return board;
}

function getBoardValueCache(board) {
	if (!USE_CACHE) return getBoardValue(board, AI);
	let boardKey = board.table.reduce((a, b) => a + b.join(""), "");
	if (useCacheOne) {
		//cacheOne has the value
		if (cacheOne.has(boardKey)) return cacheOne.get(boardKey);
		//cacheOne doesn't have the value
		let boardValue = getBoardValue(board, AI);
		cacheOne.set(boardKey, boardValue);
		return boardValue;
	}
	//cacheTwo has the value
	if (cacheTwo.has(boardKey)) return cacheTwo.get(boardKey);
	//cacheTwo doesn't have the value
	let boardValue = getBoardValue(board, AI);
	cacheTwo.set(boardKey, boardValue);
	return boardValue;
}

function minimax(board, depth, a, b, player) {
	//base case
	let validMoves = getValidMoves(board); //ordered to improve alpha-beta pruning
	let winner = didSomeoneWin(board).player;

	if (winner != 2) {
		//someone won
		return { move: -1, value: getBoardValueCache(board) };
	}

	if (validMoves.length == 0) {
		//draw
		return { move: -1, value: 0 };
	}

	if (depth == 0) {
		return { move: -1, value: getBoardValueCache(board) };
	}

	//recursion
	if (player == AI) {
		let thisIterationValue = Number.NEGATIVE_INFINITY;
		let thisIterationMove = validMoves[0];
		for (let i of validMoves) {
			let boardCopy = JSON.parse(JSON.stringify(board)); //deep copy
			playMove(boardCopy, i, AI);
			let results = minimax(boardCopy, depth - 1, a, b, SIMULATED_ADVERSARY); //boardCopy
			results.value *= 0.9999; //favor shorter games if winning, longer ones if losing
			if (results.value > thisIterationValue) {
				thisIterationValue = results.value;
				thisIterationMove = i;
			}

			//alpha-beta pruning
			a = Math.max(a, thisIterationValue);
			if (a >= b) break;
		}
		return { value: thisIterationValue, move: thisIterationMove };
	} else if (player == SIMULATED_ADVERSARY) {
		let thisIterationValue = Number.POSITIVE_INFINITY;
		let thisIterationMove = validMoves[0];
		for (let i of validMoves) {
			let boardCopy = JSON.parse(JSON.stringify(board)); //deep copy
			playMove(boardCopy, i, SIMULATED_ADVERSARY);
			let results = minimax(boardCopy, depth - 1, a, b, AI); //boardCopy
			results.value *= 0.9999; //favor shorter games if winning, longer ones if losing
			if (results.value < thisIterationValue) {
				thisIterationValue = results.value;
				thisIterationMove = i;
			}

			//alpha-beta pruning
			b = Math.min(b, thisIterationValue);
			if (b <= a) break;
		}
		return { value: thisIterationValue, move: thisIterationMove };
	}
}
