<script>
	import { gameStore, mediaStore } from "$stores";
	export let mode = "PVP"; // "PVC"
	export let position = "left"; // "right"
</script>

<div
	class="score-card {position} {$mediaStore.screenClassList}"
	style:--lar-tab-margin-bottom={$mediaStore.misc.hoverable ? "14px" : "-10px"}
>
	{#if position == "left"}
		{@const imgName = mode == "PVP" ? "player-one" : "you"}
		<img src="/images/{imgName}.svg" alt={imgName} />
		<span class="player-name">
			{mode == "PVP" ? "PLAYER " + 1 : "YOU"}
		</span>
		<span class="score">{$gameStore.scores[0]}</span>
	{:else if position == "right"}
		{@const imgName = mode == "PVP" ? "player-two" : "cpu"}
		<img src="/images/{imgName}.svg" alt={imgName} />
		<span class="player-name">
			{mode == "PVP" ? "PLAYER " + 2 : "CPU"}
		</span>
		<span class="score">{$gameStore.scores[1]}</span>
	{/if}
</div>

<style lang="scss">
	$img-horizontal-offset: 27px; //half of img width
    $size-1: (148px, 375px); //value, screen size
    $size-2: (200px, 480px);
    $size-3: (278px, 768px);
    $size-4: (336px, 1080px);

	.score-card {
		@extend %box-shadow;
		margin-left: $img-horizontal-offset - 5px;
		position: relative; //anchor for img
		display: flex;
		flex-direction: column;
		align-items: center;
        width: minMaxSizeList($size-1, $size-2);
		padding: 10px;
		margin-bottom: 12px;
		box-sizing: border-box;
		background: white;
		border-radius: 20px;
	}
	.score-card.right {
		margin-left: 0;
		margin-right: $img-horizontal-offset - 5px;
	}
	.score-card.tab {
		width: minMaxSizeList($size-2, $size-3);
		padding: 14.5px 17px;
		margin-bottom: var(--lar-tab-margin-bottom); //makes space for marker, if present
		flex-direction: row;
		justify-content: space-evenly;
	}
	.right.tab {
		flex-direction: row-reverse;
	}
	.score-card.lar-tab {
		width: minMaxSizeList($size-3, $size-4);
	}
	.score-card.des {
		flex-direction: column;
		justify-content: center;
		margin: 0;
		padding-top: 40px;
		width: 147px;
		height: 166px;
	}

	.player-name {
		@extend %heading-XS;
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
		min-width: 1ch;
		text-align: center;
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
