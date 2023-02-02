<script>
    export let thisDialog;
</script>

<div class="rules-box never-fullscreen">
	<h1>RULES</h1>
	<h2>OBJECTIVE</h2>
	<p>
		Be the first player to connect 4 of the same colored discs in a row (either vertically,
		horizontally, or diagonally).
	</p>
	<h2>HOW TO PLAY</h2>
	<ol>
		<li>Red goes first in the first game.</li>
		<li>Players must alternate turns, and only one disc can be dropped in each turn.</li>
		<li>The game ends when there is a 4-in-a-row or a stalemate.</li>
		<li>The starter of the previous game goes second on the next game.</li>
	</ol>
    <button class="close" on:click={()=>{thisDialog.myClose()}}>
        <img src="/images/icon-check.svg" alt="close">
    </button>
</div>


<style lang="scss">
    :global(dialog):has(> .rules-box)::backdrop {
        background: var(--purple);
    }
	.rules-box {
        --horizontal-padding: #{minMaxSize(21px, 34px)};
		padding: 30px var(--horizontal-padding) 38px var(--horizontal-padding);
	}

	h1 {
		text-align: center;
		margin: 0;
        margin-bottom: 29px;
	}

	h2 {
        @extend %heading-S;
        /*Should be heading-S because of design, but if I use h3 with no h2 there's an accessibility issue*/
        align-self: flex-start;
		color: var(--purple);
		margin: 0;
	}

    p {
        margin-bottom: 33px;
        /*This margin collapses with the h3 below it*/
    }

    ol {
        list-style: none;
        margin: 0 0 8px -0.9rem;
        margin-left: -0.9rem;
    }
    li {
        margin: 12px 0;
    }
    li::marker {
        content: counter(list-item)"\a0\a0\a0\a0";
        font-weight: bold;
        color: black;
    }

    button.close {
        position: absolute;
        left: calc(50% - 35px);
        bottom: calc(0% - 40px);
        padding: 0;
        border: none;
        background: none;
        border-radius: 50%;
        cursor: pointer;
    }
    .close img {
        display: block;
    }
</style>
