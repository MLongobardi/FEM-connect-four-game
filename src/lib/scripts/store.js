import { writable } from "svelte/store";
import { getValidMoves, didSomeoneWin } from "$scripts/game-scripts.js";

const cleanState = {
	board: {
		table: [
			[2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2],
		],
		depths: [5, 5, 5, 5, 5, 5, 5],
		/*
			//test
			table: [
				[2, 2, 2, 1, 1, 0, 2],
				[2, 2, 2, 1, 0, 1, 2],
				[2, 2, 2, 1, 1, 1, 2],
				[0, 2, 2, 0, 1, 0, 2],
				[0, 1, 0, 1, 0, 0, 0],
				[0, 1, 0, 0, 1, 0, 1],
			],
			depths: [2, 3, 3, -1, -1, -1, 3],
			*/
	},
	currentPlayer: 0,
	moveHistory: "",
	gameOver: false,
	winInfo: { player: 2, cells: [] },
};

function createStore() {
	//initialize store
	const tempStore = writable(cleanState);

	//define custom store methods
	tempStore.playMove = (move) => {
		tempStore.update((draft) => {
			if (draft.board.depths[move] >= 0 && !draft.gameOver) {
				draft.board.table[draft.board.depths[move]][move] = draft.currentPlayer;
				draft.board.depths[move]--;
				draft.currentPlayer = 1 - draft.currentPlayer;
				draft.moveHistory += move;
			}
			return draft;
		});
		tempStore.isGameOver();
	};

	tempStore.undoLastMove = () => {
		tempStore.update((draft) => {
			if (draft.moveHistory.length > 0) {
				let move = draft.moveHistory.charAt(draft.moveHistory.length - 1)
				if (draft.gameOver) {
					draft.gameOver = false;
					draft.winInfo = { player: 2, cells: [] };
				}
				draft.moveHistory = draft.moveHistory.slice(0, -1);
				draft.currentPlayer = 1 - draft.currentPlayer;
				draft.board.depths[move]++;
				draft.board.table[draft.board.depths[move]][move] = 2;
			}
			return draft;
		});
	}

	tempStore.isGameOver = () => {
		tempStore.update((draft) => {
			draft.winInfo = didSomeoneWin(draft.board)
			if (getValidMoves(draft.board).length <= 0 || draft.winInfo.player != 2) {
				draft.gameOver = true;
			}
			return draft;
		})
	}

	tempStore.resetGame = () => {
		tempStore.update((draft) => {
			draft.board.table = draft.board.table.map((row) => row.map(() => 2));
			draft.board.depths = draft.board.depths.map(() => 5);
			draft.currentPlayer = 0;
			draft.gameOver = false;
			draft.winInfo = { player: 2, cells: [] };
			return draft;
		})
	}

	//remove standard store methods with object destructuring and return store
	//eslint-disable-next-line
	const { set, update, ...returnStore } = tempStore; //playMove, undoLastMove, isGameOver, resetGame
	return returnStore; // subscribe, myMethod
}

export const gameStore = createStore();
