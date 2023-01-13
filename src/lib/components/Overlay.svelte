<script>
    import { frontStore } from "$stores";
    import { MenuBox, PauseBox, RulesBox } from "$comps";
    
    const colorArray = ["var(--dark-purple)", "rgba(0, 0, 0, 0.5)", "var(--purple)"]
    $: colorIndex = ["menu", "pause", "rules"].indexOf($frontStore.currentModal)

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
    {:else}
        <RulesBox />
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
		z-index: 2;
	}

    :global(body):has(.overlay) {
        overflow-y: hidden;
    }
</style>
