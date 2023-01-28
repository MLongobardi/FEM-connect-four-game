/**
 * mediaQueries.screen entries should go from smallest screen to biggest and in camelCase
 * The mobile one can't contain min-width, non-mobile ones must include it
 * $mediaStore.screenClassList returns a list of css classes which consists of the first 3 characters of each key converted into kebab-case
 * For example, the largeTablet key becomes the lar-tab class
 */
export const mediaQueries = {
	screen: {
		mobile: "(max-width: 479px)",
		tablet: "(min-width: 480px) and (max-width: 767px)",
		largeTablet: "(min-width: 768px) and (max-width: 1199px)",
		desktop: "(min-width: 1200px)",
	},
	misc: {
		hoverable: "(hover: hover) and (pointer: fine)",
		prefersReducedMotion: "(prefers-reduced-motion: reduce)",
	},
};