<script>
    import { frontStore } from "$stores";
	import { BigButton } from "$comps";
</script>

<div class="menu-box">
	<img class="logo" src="/images/logo.svg" alt="logo" />
	<BigButton type="pink">
		<span>PLAY VS CPU</span>
		<img src="/images/player-vs-cpu.svg" alt="player-vs-cpu" draggable="false" />
	</BigButton>
	<BigButton type="yellow" func={frontStore.closeModal}>
		<span>PLAY VS PLAYER</span>
		<img src="/images/player-vs-player.svg" alt="player-vs-player" draggable="false" />
	</BigButton>
	<BigButton type="white" func={()=>{frontStore.openModal("rules")}}>
		<span>GAME RULES</span>
	</BigButton>
</div>

<style>
	.menu-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 480px;
		padding: 47px 0;
		border: 3px solid black;
		border-radius: 40px;
		box-shadow: 0px 10px 0px black;
		background: var(--purple);
	}

	.logo {
		margin-top: 20px;
		margin-bottom: 56px;
	}
</style>
