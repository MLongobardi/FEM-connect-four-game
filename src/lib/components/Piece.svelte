<script>
	import { fade } from "svelte/transition";
	import { mediaStore } from "$stores"
	export let depth = 0, color = "", breakPoint = "(min-width: 640px)", win = false;
</script>

<span class="piece" class:big={!$mediaStore.screen.mobile} class:animated={!$mediaStore.misc.prefersReducedMotion} style:--pos={depth + 1}>
	<picture>
		<source srcset="/images/counter-{color}-large.svg" media={breakPoint}>
		<img src="/images/counter-{color}-small.svg" alt="counter-{color}" draggable="false" />
	</picture>
	{#if win}
		<span in:fade={{ delay: 250, duration: 200 }} class="win-ring">
			<span style:--color={color == "red" ? "var(--pink)" : "var(--yellow)"} />
		</span>
	{/if}
</span>

<style>
	.piece {
		position: relative; /*necessary for .win-ring's percentages*/
		max-width: 87.87%;
	}
	.piece.big {
		max-width: 79.52%;
	}
	.piece.animated {
		--drop-duration: calc(70ms * var(--pos));
		--bounce-duration: 300ms;
		animation-name: drop, bounce;
		animation-duration: var(--drop-duration), var(--bounce-duration);
		animation-timing-function: cubic-bezier(0.5, 0.05, 1, 0.5), ease;
		animation-delay: 0s, var(--drop-duration);
	}

	.piece img {
		display: block; /*.piece has 5px more height without this*/
        user-select: none;
		width: 100%;
	}

	.win-ring {
		/*53.33% of the width of the inner circle (excluding the 3px black border)*/
		--width: calc((100% - 6px) * 0.5333);
		/*53.33% of the height of the inner circle (excluding the 3px black border and extra 5px bottom border)*/
		--height: calc((100% - 11px) * 0.5333);
		display: inline-block;
		position: absolute;
		background: white;
		border-radius: 50%;
		top: calc((50% - 2.5px) - var(--height) / 2);
		left: calc(50% - var(--width) / 2);
		width: var(--width);
		height: var(--height);
		box-sizing: border-box;
		padding: calc(var(--width) * 0.2);
	}
	.win-ring span {
		display: block;
		background: var(--color);
		border-radius: 50%;
		height: 100%;
		width: 100%;
	}

    @keyframes drop {
        from { transform: translateY(calc(var(--pos) * 117% * -1)) }
        to { transform: none }
    }
    
    @keyframes bounce {
        0% { transform: translateY(0%) }
        33% { transform: translateY(-25%) }
        67% { transform: translateY(0%) }
        83% { transform: translateY(-10%) }
        92% { transform: translateY(0%) }
        96% { transform: translateY(-3%) }
        100% { transform: translateY(0) }
    }
</style>
