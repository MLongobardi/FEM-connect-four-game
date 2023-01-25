<h1>
	Loading<span class="dot d1">.</span><span class="dot d2">.</span><span class="dot d3">.</span>
</h1>

<style>
	h1 {
		color: white;
	}
	
	.dot {
		display: inline-block;
		animation: jump;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}
	.d2 {
		animation-delay: -0.333s;
	}
	.d3 {
		animation-delay: -0.666s;
	}
	
	@keyframes jump {
		33% {
			transform: translateY(0.1em);
		}
		66% {
			transform: translateY(-0.15em);
		}
		100% {
			transform: translateY(0);
		}
	}
</style>
