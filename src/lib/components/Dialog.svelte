<script>
	import { onMount } from "svelte";
	import { mediaStore, gameStore } from "$stores";

	/**
	 * Call this component in this way:
	 * <script>
	 *     let nextDialog;
	 * (<)/script>
	 * <Dialog let:dialog bind:dialog={nextDialog}>
	 *     <SomeComponent thisDialog={dialog}>
	 * </Dialog>
	 * Inside SomeComponent, thisDialog is a reference to the dialog that contains SomeComponent, use it to call thisDialog.myClose() (after export let thisDialog)
	 * In the component that calls Dialog, nextDialog is a reference to the opened dialog, use it to call nextDialog.myShowModal()
	 * 
	 * Using on:click={dialog.close} gives an Uncaught TypeError: Illegal invocation (sometimes the custom methods as well), so call it with an arrow function
	 *
	 * All of Dialog's content should be wrapped into a single topmost div.
	 * Give this div the never-fullscreen class to make it windowed even on mobile
	 *
	 * to style inside SomeComponent:
	 * :global(dialog):has(> .some-component-topmost-div)::backdrop {background: var(--dark-purple)}
	 *
	 * Note: the dialog backdrop doesn't inherit anything, so it can only use css variables declared in ::backdrop
	 */
	
	export let dialog;
	export let startOpen = false;
	export let useTimer = false;
	
	onMount(()=>{
		//hijack native methods, until they add an on:open event
		dialog.myShowModal = () => {
			if (useTimer) gameStore.pauseTimer();
			dialog.showModal();
		}
		dialog.myClose = () => {
			if (useTimer) gameStore.startTimer();
			dialog.close();
		}

		//setting the open attribute on the dialog doesn't put it at the top layer, showModal() is needed
		if (startOpen) dialog.myShowModal();
	});

	function handlePointDown(e) {
		if (startOpen) return;
		/**
		 * on:pointerdown|self fires when clicking on the backdrop (so long as the dialog has padding: 0),
		 * so clicking inside the dialog, dragging on the backdrop and releasing the click
		 * DOESN'T close the dialog
		 */
		if (e.pointerType == "touch") {
			dialog.addEventListener("touchend", dialog.myClose, { once: true });
		} else {
			dialog.addEventListener("pointerup", dialog.myClose, { once: true });
		}
	}
</script>

<dialog
	class="dialog"
	class:windowed={!$mediaStore.screen.mobile}
	bind:this={dialog}
	on:pointerdown|self={handlePointDown}
>
	<slot {dialog}>
		<div class="never-fullscreen">
			Empty Dialog!
			<button
				on:click={() => {
					dialog.myClose();
				}}>Close</button
			>
		</div>
	</slot>
</dialog>

<style lang="scss">
	dialog {
		padding: 0 !important; /*needed for correct event handling*/
		border: none;
		max-width: unset;
		max-height: unset;
		width: 100vw;
		height: 100vh;
		overflow: visible; //allows, for example, a close button to overflow
		color: inherit;
		animation: fade-in 200ms;
	}
	dialog.windowed,
	dialog:has(> .never-fullscreen) {
		@extend %box-shadow;
		border-radius: 40px;
		width: minMaxSize(335px, 480px);
		height: fit-content;
	}
	dialog > :global(div) {
		margin: 0 !important; /*same as above*/
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		padding: 47px 0;
		box-sizing: border-box;
	}
	dialog.windowed > :global(div), dialog :global(.never-fullscreen) {
		border-radius: 35px; //with dialog's overflow, fixes some white color at the borders
	}

	:global(body):has(dialog[open]) {
		overflow: hidden;
	}

	@keyframes fade-in {
		from {opacity: 0}
		to {opacity: 1}
	}
</style>
