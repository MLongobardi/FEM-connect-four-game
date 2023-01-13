<script>
	import { frontStore, gameStore } from "$stores";
	import { BigButton } from "$comps";

    function handleContinue() {
        frontStore.closeModal();
    }
    function handleRestart() {
        gameStore.resetGame();
        frontStore.closeModal();
    }
    function handleQuit() {
        gameStore.resetGame();
        frontStore.openModal("menu")
    }
</script>

<div class="pause-box">
	<h1>PAUSE</h1>
	<BigButton type="white" func={handleContinue}>CONTINUE GAME</BigButton>
	<BigButton type="white" func={handleRestart}>RESTART</BigButton>
	<BigButton type="pink" func={handleQuit}>QUIT GAME</BigButton>
</div>

<style>
	.pause-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 480px;
		padding: 37px 0;
		border: 3px solid black;
		border-radius: 40px;
		box-shadow: 0px 10px 0px black;
		background: var(--purple);
	}
    .pause-box :global(button) {
        justify-content: center;
    }

    h1 {
        color: white;
        margin-top: 13px;
        margin-bottom: 27px;
    }
</style>
