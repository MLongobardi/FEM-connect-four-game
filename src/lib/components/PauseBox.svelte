<script>
	import { frontStore, gameStore } from "$stores";
	import { BigButton } from "$comps";

    function handleContinue() {
        frontStore.closeModal();
        gameStore.startTimer();
    }
    function handleRestart() {
        gameStore.resetGame();
        frontStore.closeModal();
    }
    function handleQuit() {
        gameStore.hardReset();
        frontStore.openModal("menu");
    }
</script>

<div class="pause-box">
	<h1>PAUSE</h1>
	<BigButton type="white" func={handleContinue}>CONTINUE GAME</BigButton>
	<BigButton type="white" func={handleRestart}>RESTART</BigButton>
	<BigButton type="pink" func={handleQuit}>QUIT GAME</BigButton>
</div>

<style lang="scss">
	.pause-box {
        @extend %box-shadow;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: minMaxSize(335px, 480px);
		padding: minMaxSize(17px, 37px) 0;
		border-radius: 40px;
		background: var(--purple);
	}
    .pause-box :global(button) {
        justify-content: center;
    }

    h1 {
        color: white;
        margin-top: 13px;
        margin-bottom: minMaxSize(13px, 27px);
    }
</style>
