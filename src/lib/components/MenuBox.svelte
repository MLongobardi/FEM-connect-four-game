<script>
    import { gameStore } from "$stores";
	import { BigButton, Dialog, RulesBox, DifficultyBox } from "$comps";
    export let thisDialog;
    let rulesDialog, difficultyDialog;
	
	function startPVPGame() {
		gameStore.setModeAndStart("PVP");
		thisDialog.myClose()
	}
</script>

<div class="menu-box">
	<img class="logo" src="/images/logo.svg" alt="logo"/>
	<BigButton type="pink" func={()=>{difficultyDialog.myShowModal()}}>
		<span>PLAY VS CPU</span>
		<img src="/images/player-vs-cpu.svg" alt="player-vs-cpu" draggable="false" />
	</BigButton>
	<BigButton type="yellow" func={startPVPGame}>
		<span>PLAY VS PLAYER</span>
		<img src="/images/player-vs-player.svg" alt="player-vs-player" draggable="false" />
	</BigButton>
	<BigButton type="white" func={()=>{rulesDialog.myShowModal()}}>
		<span>GAME RULES</span>
	</BigButton>

    <Dialog let:dialog bind:dialog={rulesDialog}>
        <RulesBox thisDialog={dialog} />
    </Dialog>
    <Dialog useTimer let:dialog bind:dialog={difficultyDialog}>
        <DifficultyBox thisDialog={dialog} menuDialog={thisDialog}/>
    </Dialog>
</div>

<style lang="scss">
    :global(dialog):has(> .menu-box)::backdrop {
        background: var(--dark-purple);
    }

	.menu-box {
		background: var(--purple);
	}

	.logo {
		margin-top: 20px;
		margin-bottom: 56px;
	}
</style>