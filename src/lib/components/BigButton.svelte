<script>
	export let type = "white";
	export let func = () => {};

	let bgColor = "white";
	let	txtColor = "black";
	if (type == "yellow") bgColor = "var(--yellow)";
	if (type == "pink") {
		bgColor = "var(--pink)";
		txtColor = "white";
	}
</script>

<button style:background-color={bgColor} style:color={txtColor} on:click={func}>
	<slot>Empty button</slot>
</button>

<style lang="scss">
	button {
		@extend %box-shadow-hoverable;
		@extend %heading-M;
		display: flex;
		justify-content: space-between;
		align-items: center;
		/*Can't use box-sizing: content-box because it would mess with padding, so width and height are increased by 6px to account for the border*/
		width: minMaxSize(341px, 406px);
		max-width: 89.85%;
		min-height: 78px;
		padding: 0 17px 0 20px;
		border-radius: 20px;
		margin-top: 14px;
		margin-bottom: 10px;
	}
	button:active {
		box-shadow: 0px 5px 0px var(--shadow-color);
		margin-bottom: 5px;
		margin-top: 19px;
	}
</style>
