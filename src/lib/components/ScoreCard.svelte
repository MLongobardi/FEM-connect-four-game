<script>
    import { gameStore, mediaStore } from "$stores";
    export let mode = "PVP"; // "PVC"
    export let position = "left"; // "right"
</script>

<div class="score-card {position} {$mediaStore.screenClassList}">
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
    $img-horizontal-offset: 27px; /*half of img width*/

    .score-card {
        @extend %box-shadow;
        margin-left: $img-horizontal-offset - 5px;
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
    .score-card.right {
        margin-left: 0;
        margin-right: $img-horizontal-offset - 5px;
    }
    .score-card.des {
        flex-direction: column;
        justify-content: center;
        margin: 0;
        padding-top: 20px;
        width: 147px;
        height: 166px;
    }

    .right:not(.des) {
        flex-direction: row-reverse;
    }

    .player-name {
        @extend %heading-XS;
        padding: 0 15px;
    }
    :is(.tab, .lar-tab, .des) .player-name {
        @extend %heading-S;
    }

    .score {
        /*non-standard font-size*/
        font-size: 32px;
        line-height: 41px;
        font-weight: bold;
        color: black;
    }
    :is(.tab, .lar-tab, .des) .score {
        @extend %heading-L;
    }

    img {
        position: absolute;
        left: -$img-horizontal-offset;
    }
    .right img {
        left: unset;
        right: -$img-horizontal-offset;
    }
    .des img {
        left: unset;
        right: unset;
        top: -29.5px; //*half of img height*/
    }
</style>