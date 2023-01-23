import { writable } from "svelte/store";
import { getValidMoves, didSomeoneWin } from "$scripts/game-scripts.js";
import { getAIMove } from "$scripts/computer-ai.js";
//make a method to make an AI move

const TIMER_TICK_RATE = 50;

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
	scores: [12, 23, 0], //red wins, yellow wins, draws
	lastWinner: "",
	AIDepth: 5,
	timer: {
		startTime: 15,
		running: false,
		currentTime: 15,
		deltaTime: 0,
		interval: "",
	},
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
				draft.timer.currentTime = draft.timer.startTime;
				draft.moveHistory += move;
			}
			return draft;
		});
		tempStore.isGameOver();
	};

	tempStore.undoLastMove = () => {
		tempStore.update((draft) => {
			if (draft.moveHistory.length > 0) {
				let move = draft.moveHistory.charAt(draft.moveHistory.length - 1);
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
	};

	tempStore.isGameOver = () => {
		tempStore.update((draft) => {
			if (!draft.gameOver) {
				draft.winInfo = didSomeoneWin(draft.board);
				if (getValidMoves(draft.board).length <= 0 || draft.winInfo.player != 2) {
					tempStore.pauseTimer();
					draft.scores[draft.winInfo.player]++;
					draft.lastWinner = draft.winInfo.player;
					draft.gameOver = true;
				}
			}
			return draft;
		});
	};

	tempStore.resetGame = () => {
		tempStore.update((draft) => {
			draft.board.table = draft.board.table.map((row) => row.map(() => 2));
			draft.board.depths = draft.board.depths.map(() => 5);
			draft.currentPlayer = 0;
			draft.gameOver = false;
			draft.winInfo = { player: 2, cells: [] };
			draft.timer.currentTime = draft.timer.startTime;
			return draft;
		});
		tempStore.startTimer();
	};

	tempStore.hardReset = () => {
		tempStore.resetGame();
		tempStore.pauseTimer();
		tempStore.update((draft) => {
			draft.scores = [0, 0, 0];
			return draft;
		});
	};

	tempStore.setModeAndStart = (mode) => {
		if (mode == "PVP" || mode == "PVC") {
			tempStore.update((draft) => {
				tempStore.pauseTimer();
				draft.currentMode = mode;
				if (mode == "PVP") {
					draft.timer.startTime = 30;
					draft.timer.currentTime = 30;
				}
				tempStore.startTimer();
				return draft;
			});
			
		}
	};

	tempStore.setDifficulty = (difficulty) => {
		tempStore.update((draft) => {
			if (difficulty == "easy") {
				draft.AIDepth = 3;
				draft.timer.startTime = 45;
				draft.timer.currentTime = 45;
			}
			if (difficulty == "normal") {
				draft.AIDepth = 4;
				draft.timer.startTime = 30;
				draft.timer.currentTime = 30;
			}
			if (difficulty == "hard") {
				draft.AIDepth = 5;
				draft.timer.startTime = 20;
				draft.timer.currentTime = 20;
			}
			return draft;
		});
	};

	tempStore.startTimer = () => {
		tempStore.update((draft) => {
			if (draft.timer.running) return draft;
			draft.timer.running = true;
			draft.timer.interval = setInterval(() => {
				draft.timer.deltaTime += TIMER_TICK_RATE;
				if (draft.timer.deltaTime >= 1000) {
					draft.timer.deltaTime -= 1000;
					tempStore.timerTick();
				}
			}, TIMER_TICK_RATE);
			return draft;
		});
	};

	tempStore.timerTick = () => {
		tempStore.update((draft) => {
			draft.timer.currentTime--;
			if (draft.timer.currentTime <= 0) {
				draft.currentPlayer = 1 - draft.currentPlayer;
				draft.timer.currentTime = draft.timer.startTime;
				if (draft.currentPlayer == 1 && draft.currentMode == "PVC") {
					setTimeout(() => {
						tempStore.playMove(getAIMove(draft, draft.AIDepth));
					}, 400);
				}
			}
			return draft;
		});
	};

	tempStore.pauseTimer = () => {
		tempStore.update((draft) => {
			if (!draft.timer.running) return draft;
			draft.timer.running = false;
			clearInterval(draft.timer.interval);
			draft.timer.interval = "";
			return draft;
		});
	};

	//remove standard store methods with object destructuring and return store
	//eslint-disable-next-line
	const { set, update, timerTick, ...returnStore } = tempStore;
	return returnStore; //subscribe and custom store methods
}

const gameStore = createStore();
export default gameStore;
