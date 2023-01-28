<script>
    import { gameStore } from "$stores";
	import { BigButton } from "$comps";

    export let thisDialog, menuDialog;

	function startPVCGame(difficulty) {
        gameStore.setDifficulty(difficulty);
		gameStore.setModeAndStart("PVC");
        menuDialog.myClose();
        thisDialog.myClose();
	}
</script>

<div class="difficulty-box">
    <img src="/images/cpu.svg" alt="cpu" draggable="false"/>
	<BigButton type="pink" func={()=>{startPVCGame("easy")}}>
		<span>EASY</span>
	</BigButton>
	<BigButton type="yellow" func={()=>{startPVCGame("normal")}}>
		<span>NORMAL</span>
	</BigButton>
	<BigButton type="white" func={()=>{startPVCGame("hard")}}>
		<span>HARD</span>
	</BigButton>
</div>

<style lang="scss">
    :global(dialog):has(> .difficulty-box)::backdrop {
        background: var(--dark-purple);
    }

	.difficulty-box {
		background: var(--purple);
	}

    .difficulty-box :global(button) {
        justify-content: center;
    }

    img {
        width: 58px; /*same as MenuBox logo*/
        height: 61px;
		margin-top: 20px;
		margin-bottom: 56px;
	}
</style>