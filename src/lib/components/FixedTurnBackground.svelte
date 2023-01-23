<script>
	/**
	 * Don't add a <style> tag to this component, or svelte will add its scoping classes
	 * And the html validator says that, for example, <feComposite> shouldn't have a class
	 * Style from the parent with .parent-name :global(svg) {}
	 */
	export let color = "red"; //or "yellow"
	export let turnText = "YOUR TURN";
	export let time = 15;
	$: textColor = color == "red" ? "#FFF" : "#000";
	$: backgroundColor = color == "red" ? "#FD6687" : "#FFCE67";
</script>

<!--prettier-ignore-->
<svg
	width="197"
	height="165"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
>
	<defs>
        <filter
			x="-4.2%"
			y="-4.2%"
			width="108.4%"
			height="116.2%"
			filterUnits="objectBoundingBox"
			id="a"
		>
            <feMorphology
				radius="3"
				operator="dilate"
				in="SourceAlpha"
				result="shadowSpreadOuter1"
			/>
            <feOffset dy="10" in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
            <feComposite
				in="shadowOffsetOuter1"
				in2="SourceAlpha"
				operator="out"
				result="shadowOffsetOuter1"
			/>
            <feColorMatrix
				values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
				in="shadowOffsetOuter1"
			/>
        </filter>
        <path
			d="M12.239 34.847 87.279 3.25a20 20 0 0 1 15.454-.029l75.96 31.65A20 20 0 0 1 191 53.333V130c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V53.28a20 20 0 0 1 12.239-18.433Z"
			id="b"
		/>
    </defs>
    <g transform="translate(3 2)" fill="none" fill-rule="evenodd">
		<use fill="#000" filter="url(#a)" xlink:href="#b" />
        <path
			stroke="#000"
			stroke-width="3"
			d="M86.697 1.868a21.5 21.5 0 0 1 16.613-.03l75.96 31.65a21.478 21.478 0 0 1 9.62 7.92 21.478 21.478 0 0 1 3.61 11.925V130a21.433 21.433 0 0 1-6.297 15.203A21.433 21.433 0 0 1 171 151.5H20a21.433 21.433 0 0 1-15.203-6.297A21.433 21.433 0 0 1-1.5 130V53.28c0-4.326 1.296-8.44 3.589-11.893a21.478 21.478 0 0 1 9.568-7.923Z"
			fill="{backgroundColor}"
		/>
        <g fill="{textColor}" font-family="SpaceGrotesk-Bold, Space Grotesk" font-weight="bold">
            <text font-size="16" transform="translate(51 41)">
				<tspan x="1.64" y="16">{turnText}</tspan>
			</text>
            <text font-size="56" transform="translate(51 41)">
				<tspan x="{0.872 + time < 10 ? 20 : 0}" y="77" >{time + "s"}</tspan>
			</text>
        </g>
    </g>
</svg>