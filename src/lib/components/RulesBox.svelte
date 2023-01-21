<script>
    import { frontStore } from "$stores";
</script>

<div class="rules-box">
	<h1>RULES</h1>
	<h3>OBJECTIVE</h3>
	<p>
		Be the first player to connect 4 of the same colored discs in a row (either vertically,
		horizontally, or diagonally).
	</p>
	<h3>HOW TO PLAY</h3>
	<ol>
		<li>Red goes first in the first game.</li>
		<li>Players must alternate turns, and only one disc can be dropped in each turn.</li>
		<li>The game ends when there is a 4-in-a-row or a stalemate.</li>
		<li>The starter of the previous game goes second on the next game.</li>
	</ol>
    <button class="close" on:click={frontStore.closeModal}>
        <img src="/images/icon-check.svg" alt="close">
    </button>
</div>

<style lang="scss">
	.rules-box {
        @extend %box-shadow;
		width: 486px;
		padding: 30px 34px 38px 34px;
		box-sizing: border-box;
		border-radius: 40px;
		background: white;
        position: relative;
	}

	h1 {
		text-align: center;
		margin: 0;
	}

	h3 {
		color: var(--purple);
		margin: 0;
        margin-top: 29px;
	}

    p {
        margin-bottom: 33px;
        /*This margin collapses with the h3 below it*/
    }

    ol {
        list-style: none;
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

    .close {
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
