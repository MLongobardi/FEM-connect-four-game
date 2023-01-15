<script>
    import { gameStore, mediaStore } from "$stores";
    export let mode = "PVP"; // "PVC"
    export let position = "left"; // "right"
    let score = 12;
    
    /*
    mode == "pvp" && version: "1"
    name: "PLAYER 1",
    src: "/images/player-one.svg",
    position: "left",
    --------------
    name: "PLAYER 2",
    src: "/images/player-two.svg",
    position: "right",
    --------------
    name: "YOU",
    src: "/images/you.svg",
    position: "left",
    --------------
    name: "CPU",
    src: "/images/cpu.svg",
    position: "right",
    --------------
    */
</script>

<div class="score-card {position}" class:big={$mediaStore.screen.desktop}>
    {#if position == "left"}
        {@const imgName = mode == "PVP" ? "player-one" : "you"}
        <img src="/images/{imgName}.svg" alt="{imgName}">
        <h3 class="player-name">
            {mode == "PVP" ? "PLAYER " + 1 : "YOU"}
        </h3>
        <h1 class="score">{$gameStore.scores[0]}</h1>
    {:else if position == "right"}
        {@const imgName = mode == "PVP" ? "player-two" : "cpu"}
        <img src="/images/{imgName}.svg" alt="{imgName}">
        <h3 class="player-name">
            {mode == "PVP" ? "PLAYER " + 2 : "CPU"}
        </h3>
        <h1 class="score">{$gameStore.scores[1]}</h1>
    {/if}
</div>

<style>
    .score-card {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: center;
        width: 45%;
        box-sizing: border-box;
        background: white;
        border: 3px solid black;
        border-radius: 20px;
        box-shadow: 0px 10px 0px black;
    }
    .score-card.big {
        flex-direction: column;
        justify-content: center;
        padding-top: 20px;
        width: 147px;
        height: 166px;
    }

    h1, h3 {
        margin: 0;
    }
    h1 {
        padding: 0 15px;
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