import { writable } from "svelte/store";
const cleanState = {
	example: 1,
	arrayExample: [0,1,2,3,4],
	get getterExample() {
		return this.arrayExample[this.example];
	}
};

function createStore() {
	//initialize store
	const tempStore = writable(cleanState);

	//define custom store methods
	tempStore.myMethod = () => {
		tempStore.update((draft) => {
			if (draft.example < draft.arrayExample.length) {
				draft.example++
			}
			return draft;
		});
	};

	//remove standard store methods with object destructuring and return store
	//eslint-disable-next-line
	const { set, update, ...returnStore } = tempStore;
	return returnStore; // subscribe, myMethod
}

export const gameStore = createStore();
