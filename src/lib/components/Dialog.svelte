<script>
	import { gameStore } from "$stores";
	/**
	 * Call this component in this way:
	 * <Dialog let:dialog>
	 *     <SomeComponentName {dialog}>
	 * </Dialog>
	 * That "dialog" is a reference to the html element, so you can call dialog.close() in a button inside SomeComponentName
	 *
	 * .dialog-inner should be styled in SomeComponentName's style tag, selecting it with:
	 * :global(.dialog-inner):has(.some-component-name-element) {}
	 * 
	 * to style backdrop color:
	 * :global(dialog::backdrop):has(.some-component-name-element) {background: var(--dark-purple)}
	 */
	
	let dialog;
	
	function handlePointDown(e) {
		/**
		 * on:pointerdown|self fires when clicking on the backdrop (so long as the dialog has padding: 0),
		 * so clicking inside the dialog, dragging on the backdrop and releasing the click
		 * DOESN'T close the dialog
		 */
		if (e.pointerType == "touch") {
			dialog.addEventListener("touchend", dialog.close, { once: true });
		} else {
			dialog.addEventListener("pointerup", dialog.close, { once: true });
		}
	}
</script>

<button
	on:click={() => {
		//using dialog.showModal directly without an arrow function gives an Uncaught TypeError: Illegal invocation
		dialog.showModal();
	}}
>
	showModal
</button>

<dialog
	class="dialog"
	bind:this={dialog}
	on:pointerdown|self={handlePointDown}
	on:close={() => {
		//timer
		console.log("closed");
	}}
>
	<div class="dialog-inner">
        <slot {dialog}></slot>
    </div>
</dialog>

<style lang="scss">
	dialog {
        @extend %box-shadow;
        border-radius: 40px;
		padding: 0 !important; /*needed for correct event handling*/
	}
	dialog::backdrop {
		background: var(--dark-purple);
	}

	.dialog-inner {
		margin: 0 !important; /*same as above*/
		padding: 50px;
	}
</style>
