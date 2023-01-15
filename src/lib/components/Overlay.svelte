<script>
    import { frontStore } from "$stores";
    import { MenuBox, PauseBox, RulesBox, DifficultyBox } from "$comps";
    
    const colorArray = ["var(--dark-purple)", "rgba(0, 0, 0, 0.5)", "var(--purple)", "var(--dark-purple)"]
    $: colorIndex = ["menu", "pause", "rules","difficulty"].indexOf($frontStore.currentModal)
    
    function handleClick() {
        if ($frontStore.currentModal == "menu") return;
        frontStore.closeModal();
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="overlay" style:background={colorArray[colorIndex]} on:click|self={handleClick}>
    {#if $frontStore.currentModal == "menu"}
        <MenuBox />
    {:else if $frontStore.currentModal == "pause"}
        <PauseBox />
    {:else if $frontStore.currentModal == "rules"}
        <RulesBox />
    {:else if $frontStore.currentModal == "difficulty"}
        <DifficultyBox />
    {/if}
</div>

<style>
	.overlay {
		display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
		height: 100vh;
		background: var(--color);
		position: fixed;
        top: 0;
		z-index: 10;
	}

    :global(body):has(.overlay) {
        overflow-y: hidden;
    }
</style>
