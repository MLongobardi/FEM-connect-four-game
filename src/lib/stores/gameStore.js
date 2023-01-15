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
	},
	currentPlayer: 0,
	currentMode: "PVP", // or "PVC"
	moveHistory: "",
	gameOver: false,
	winInfo: { player: 2, cells: [] },
	scores: [0, 0, 0], //red wins, yellow wins, draws
	lastWinner: "",
	AIDepth: 5,
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
				tempStore.isGameOver();
			}
			return draft;
		});
		
	};

	tempStore.undoLastMove = () => {
		tempStore.update((draft) => {
			if (draft.moveHistory.length > 0) {
				let move = draft.moveHistory.charAt(draft.moveHistory.length - 1)
				if (draft.gameOver) {
					draft.gameOver = false;
					draft.scores[draft.lastWinner]--;
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
				draft.scores[draft.winInfo.player]++;
				draft.lastWinner = draft.winInfo.player;
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

	tempStore.hardReset = () => {
		tempStore.resetGame();
		tempStore.update((draft) => {
			draft.scores = [0, 0, 0];
			return draft;
		})
	}

	tempStore.setMode = (mode) => {
		if (mode == "PVP" || mode == "PVC") {
			tempStore.update((draft) => {
				draft.currentMode = mode;
				return draft;
			});
		}
	}

	tempStore.setDifficulty = (difficulty) => {
		tempStore.update((draft) => {
			if (difficulty == "easy") draft.AIDepth = 2;
			if (difficulty == "normal") draft.AIDepth = 3;
			if (difficulty == "hard") draft.AIDepth = 4;
			return draft;
		})
	}

	//remove standard store methods with object destructuring and return store
	//eslint-disable-next-line
	const { set, update, ...returnStore } = tempStore; //playMove, undoLastMove, isGameOver, resetGame, hardReset, setMode, setDifficulty
	return returnStore; // subscribe, myMethod
}

const gameStore = createStore();
export default gameStore;
