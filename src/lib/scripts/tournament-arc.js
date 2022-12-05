import { didSomeoneWin, getValidMoves } from "$scripts/game-scripts.js";
import { getAIMove } from "$scripts/computer-ai.js";
import { HEURISTIC_FIGHTER_ONE, HEURISTIC_FIGHTER_TWO } from "$scripts/heuristics.js";

//NOT READY YET
//need to change resetGame and playerMove into gameBoard methods

const tournamentArcInfo = {
	movedFirst: "",
	AIIsBattling: false,
	totalRuns: 20,
	currentRun: 0,
	results: {
		red_one: 0, //fighter one moved first
		yellow_one: 0, //fighter one moved second
		red_two: 0, //fighter two moved first
		yellow_two: 0, //fighter two moved second
		draws: 0,
	},
};

function tournamentArc(board, runs) {
	if (tournamentArcInfo.AIIsBattling) return;
	tournamentArc.totalRuns = runs;
	board.resetGame();

	tournamentArcInfo.AIIsBattling = true;
	let firstPlayer = Math.random() < 0.5 ? 0 : 1;
	tournamentArcInfo.movedFirst = ["one", "two"][firstPlayer];
	AIBattle(firstPlayer, board);
}

function stopBattle(board) {
	tournamentArcInfo.AIIsBattling = false;
	let winner = didSomeoneWin(board);
	if (winner < 0) tournamentArcInfo.results.draws++;
	else {
		let winnerColor = ["red", "yellow"][winner];
		let x = winnerColor + "_" + tournamentArcInfo.movedFirst;
		tournamentArcInfo.results[x]++;
		console.log(x, "run " + tournamentArcInfo.currentRun);
	}
	tournamentArcInfo.currentRun++;
	if (tournamentArcInfo.currentRun <= tournamentArcInfo.totalRuns) tournamentArc(board);
	else console.log(tournamentArcInfo.results);
}

function AIBattle(order, board) {
	if (getValidMoves(board) <= 0 || didSomeoneWin(board) >= 0) return stopBattle(board);

	fighter(order).then(() => {
		if (getValidMoves(board) <= 0 || didSomeoneWin(board) >= 0) return stopBattle(board);
		fighter(1 - order).then(() => {
			AIBattle(order, board);
		});
	});
}

async function fighter(number = 0, board) {
	let move = -1;
	if (number == 0) {
		//fighter one
		move = await getAIMove(board, 4, HEURISTIC_FIGHTER_ONE);
	} else if (number == 1) {
		//fighter two
		move = await getAIMove(board, 4, HEURISTIC_FIGHTER_TWO);
	}
	board.playMove(move);
}
