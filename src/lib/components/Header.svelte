<script>
	import { gameStore } from "$scripts/store.js";
</script>


<header>
	<div style="background: white; padding: 15px; border-radius: 25px; margin-top: 35px;">
		current player: <img
			src="/images/player-{$gameStore.currentPlayer ? 'two' : 'one'}.svg"
			alt="current-player"
		/>
	</div>
</header>

<style>
</style>
