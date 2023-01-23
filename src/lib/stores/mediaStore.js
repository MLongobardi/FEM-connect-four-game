import { readable, derived } from "svelte/store";
import { mediaQueries } from "$lib/myConfig.js";

function keyToClassName(key) {
	if (!mediaQueries.screen[key].includes("min-width")) return ""; //no class for the mobile media query (which is the default style, mobile-first)
	return key
		.split(/(?=[A-Z])/) //multipleWordKey => ["multiple", "Word", "Key"]
		.map((word) => word.substring(0, 3).toLowerCase()) //["multiple", "Word", "Key"] => ["mul", "wor", "key"]
		.join("-"); //["mul", "wor", "key"] => mul-wor-key
}

const classStrings = Object.fromEntries(
	Object.keys(mediaQueries.screen).map((key, i, arr) => [
		key,
		arr
			.map(keyToClassName)
			.slice(0, i + 1)
			.join(" "),
	])
);

function createSingleStore(query) {
	return readable(null, (set) => {
		let stop = () => {};

		if (typeof window != "undefined") {
			const mq = window.matchMedia(query);
			const update = () => set(mq.matches);
			update();
			mq.addEventListener("change", update);
			stop = () => {
				mq.removeEventListener("change", update);
			};
		}

		return stop;
	});
}

function createGroupStore(queries) {
	const storesObject = {};
	for (const [queryName, queryString] of Object.entries(queries)) {
		storesObject[queryName] = createSingleStore(queryString);
	}
	return derived(Object.values(storesObject), ($stores) => {
		const objectToReturn = {};
		Object.keys(queries).forEach((key, i) => {
			objectToReturn[key] = $stores[i];
		});

		return objectToReturn;
	});
}

const screenStore = createGroupStore(mediaQueries.screen);
const miscStore = createGroupStore(mediaQueries.misc);

const mediaStore = derived([screenStore, miscStore], ([$screen, $misc]) => {
	let currentScreen = Object.keys($screen).find((key) => $screen[key] == true) || "";
	return {
		screen: $screen,
		currentScreen: currentScreen,
		screenClassList: classStrings[currentScreen] || "",
		misc: $misc,
	};
});

export default mediaStore;
