import { writable } from "svelte/store";

const cleanState = {
    currentModal: "",
    showModal: true,
}

function createStore() {
	//initialize store
	const tempStore = writable(cleanState);

	//define custom store methods
    tempStore.openModal = (modal) => {
        tempStore.update((draft) => {
            if (["menu", "pause", "rules", "difficulty"].includes(modal)) {
                draft.currentModal = modal;
                draft.showModal = true;
            } else {
                console.error("Tried to open a nonexistent modal: ", modal)
            }
            return draft;
        })
    }

    tempStore.closeModal = () => {
        tempStore.update((draft) => {
            if (draft.currentModal == "rules" || draft.currentModal == "difficulty") {
                draft.currentModal = "menu";
            } else {
                draft.currentModal = "";
                draft.showModal = false;
            }
            return draft;
        })
    }
	
	//remove standard store methods with object destructuring and return store
	//eslint-disable-next-line
	const { set, update, ...returnStore } = tempStore;
	return returnStore;
}

const frontStore = createStore();
export default frontStore;