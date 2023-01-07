<script>
	import { gameStore } from "$scripts/store.js";
	

	let colors = ["var(--pink)", "var(--yellow)", "var(--dark-purple)"];

</script>

<footer style:--color={colors[$gameStore.winInfo.player]}>

</footer>

<style>
	footer {
		border-radius: 60px 60px 0 0;
		background-color: var(--color);
		height: 200px;
		width: 100%;

		transition: background-color 200ms;
		transition-delay: 250ms;
		text-align: center;
	}
	text {
		position: absolute;
		bottom: -40px;
		z-index: 3;
	}
</style>
