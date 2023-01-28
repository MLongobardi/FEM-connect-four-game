<script>
	import { gameStore } from "$stores";
	import { BigButton } from "$comps";
    export let thisDialog, menuDialog;

    function handleRestart() {
        gameStore.resetGame();
        thisDialog.myClose();
    }
    function handleQuit() {
        menuDialog.myShowModal();
        thisDialog.myClose();
        gameStore.hardReset();
    }
</script>

<div class="pause-box never-fullscreen">
	<h1>PAUSE</h1>
	<BigButton type="white" func={()=>{thisDialog.myClose()}}>CONTINUE GAME</BigButton>
	<BigButton type="white" func={handleRestart}>RESTART</BigButton>
	<BigButton type="pink" func={handleQuit}>QUIT GAME</BigButton>
</div>

<style lang="scss">
    :global(dialog):has(> .pause-box)::backdrop {
        background: rgba(0, 0, 0, 0.5);
    }

	.pause-box {
		padding: minMaxSize(17px, 37px) 0;
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
