<script>
	import { frontStore, gameStore } from "$stores";
	import { MenuBox, PauseBox, RulesBox, DifficultyBox, Loading } from "$comps";
	import { fade } from "svelte/transition";

	const colorArray = [
		"var(--dark-purple)",
		"rgba(0, 0, 0, 0.5)",
		"var(--purple)",
		"var(--dark-purple)",
	];
	$: colorIndex = ["menu", "pause", "rules", "difficulty"].indexOf($frontStore.currentModal);
	
	function handleClick() {
		if ($frontStore.currentModal == "menu") return;
		if ($frontStore.currentModal == "pause") gameStore.startTimer();
		frontStore.closeModal();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="overlay" style:background={colorArray[colorIndex]} on:click|self={handleClick}>
	{#key $frontStore.currentModal}
		<div in:fade={{ duration: 100 }}>
			{#if $frontStore.currentModal == "menu"}
				<MenuBox />
			{:else if $frontStore.currentModal == "pause"}
				<PauseBox />
			{:else if $frontStore.currentModal == "rules"}
				<RulesBox />
			{:else if $frontStore.currentModal == "difficulty"}
				<DifficultyBox />
			{:else}
				<Loading />
			{/if}
		</div>
	{/key}
</div>

<style>
	.overlay {
		display: flex;
        background: var(--dark-purple); /*default*/
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		z-index: 10;
	}

	:global(body):has(.overlay) { /*TEMP, check if dialog takes care of it*/
		overflow-y: hidden;
	}
</style>