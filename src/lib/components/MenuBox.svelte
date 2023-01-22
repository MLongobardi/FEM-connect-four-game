<script>
    import { mediaStore, frontStore, gameStore } from "$stores";
	import { BigButton } from "$comps";

	function startPVPGame() {
		gameStore.setModeAndStart("PVP");
		frontStore.closeModal();
	}
</script>

<svelte:head>
	<link rel="preload" as="image" href="/images/logo.svg">
	<link rel="preload" as="image" href="/images/player-vs-cpu.svg">
	<link rel="preload" as="image" href="/images/player-vs-player.svg">
</svelte:head>

<div class="menu-box" class:big={!$mediaStore.screen.mobile}>
	<img class="logo" src="/images/logo.svg" alt="logo" />
	<BigButton type="pink" func={()=>{frontStore.openModal("difficulty")}}>
		<span>PLAY VS CPU</span>
		<img src="/images/player-vs-cpu.svg" alt="player-vs-cpu" draggable="false" />
	</BigButton>
	<BigButton type="yellow" func={()=>{startPVPGame()}}>
		<span>PLAY VS PLAYER</span>
		<img src="/images/player-vs-player.svg" alt="player-vs-player" draggable="false" />
	</BigButton>
	<BigButton type="white" func={()=>{frontStore.openModal("rules")}}>
		<span>GAME RULES</span>
	</BigButton>
</div>

<style lang="scss">
	.menu-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100vw;
		background: var(--purple);
	}
	.menu-box.big {
		@extend %box-shadow;
		width: minMaxSize(335px, 480px);
		height: unset;
		padding: 47px 0;
		border-radius: 40px;
	}

	.logo {
		margin-top: 20px;
		margin-bottom: 56px;
	}
</style>
