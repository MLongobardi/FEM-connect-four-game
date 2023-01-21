<script>
    import { gameStore, mediaStore } from "$stores";
    export let mode = "PVP"; // "PVC"
    export let position = "left"; // "right"
</script>

<div class="score-card {position}" class:big={$mediaStore.screen.desktop}>
    {#if position == "left"}
        {@const imgName = mode == "PVP" ? "player-one" : "you"}
        <img src="/images/{imgName}.svg" alt="{imgName}">
        <span class="player-name">
            {mode == "PVP" ? "PLAYER " + 1 : "YOU"}
        </span>
        <span class="score">{$gameStore.scores[0]}</span>
    {:else if position == "right"}
        {@const imgName = mode == "PVP" ? "player-two" : "cpu"}
        <img src="/images/{imgName}.svg" alt="{imgName}">
        <span class="player-name">
            {mode == "PVP" ? "PLAYER " + 2 : "CPU"}
        </span>
        <span class="score">{$gameStore.scores[1]}</span>
    {/if}
</div>

<style lang="scss">
    .score-card {
        @extend %box-shadow;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: center;
        width: 45%;
        box-sizing: border-box;
        background: white;
        border-radius: 20px;
    }
    .score-card.big {
        flex-direction: column;
        justify-content: center;
        padding-top: 20px;
        width: 147px;
        height: 166px;
    }

    .right:not(.big) {
        flex-direction: row-reverse;
    }

    .player-name {
        @extend %heading-S;
        padding: 0 15px;
    }
    .score {
        @extend %heading-L;
    }

    img {
        --horizontal-offset: -27px;
        position: absolute;
    }
    .left img {
        left: var(--horizontal-offset)
    }
    .right img {
        right: var(--horizontal-offset)
    }
    .big img {
        left: unset;
        right: unset;
        top: -29.5px;
    }
</style>