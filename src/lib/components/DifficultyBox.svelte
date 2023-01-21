<script>
    import { frontStore, gameStore } from "$stores";
	import { BigButton } from "$comps";
	
	function startPVCGame(difficulty) {
        gameStore.setDifficulty(difficulty);
		gameStore.setModeAndStart("PVC");
		frontStore.closeModal(); //gets back to MenuBox
        frontStore.closeModal(); //closes MenuBox
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
	.difficulty-box {
		@extend %box-shadow;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 480px;
		padding: 47px 0;
		border-radius: 40px;
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