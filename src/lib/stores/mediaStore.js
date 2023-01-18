import { readable, derived } from "svelte/store";
import { mediaQueries } from "$lib/myConfig.js"

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
	return {
		screen: $screen,
		currentScreen: Object.keys($screen).find((k) => $screen[k] == true) || "",
		misc: $misc,
	};
});

export default mediaStore;
