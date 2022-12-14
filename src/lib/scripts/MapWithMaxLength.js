/*
There's 3^42 possible boards (or close to 1.1 * 10^20). 
Technically there are much less, because that number includes illegal boards like the top row being filled while the others are empty.
But there's still enough that the cache needs a max size.

V8 developer says the max Map size is 2^24 (or 16777216):
https://stackoverflow.com/questions/54452896/maximum-number-of-entries-in-node-js-map/54466812#54466812
Deleting a Map key apparently just sets its value to empty, so you need to delete enough at once to actually free up space?
This answer includes a script that confirms that after reaching the maximum of 2^24 you need to delete half of the keys before you can start adding them again:
https://stackoverflow.com/questions/63178278/do-javascript-maps-have-a-set-amount-of-keys-that-they-can-set-or-do-they-have-a/63234302#63234302
*/

const MAX_LENGTH = Math.pow(2, 24) - 1;

export class MapWithMaxLength extends Map {
	constructor(maxLength = MAX_LENGTH, iterable) {
		super(iterable);
		if (maxLength > MAX_LENGTH) maxLength = MAX_LENGTH;
		this.maxLength = maxLength;
	}

    deleteOldest(n = this.maxLength / 2 + 1) {
        let keysIterator = this.keys();
        for (let i = 0; i < n; i++) {
			if (!this.delete(keysIterator.next().value)) break;
        }
	}

	set(key, value) {
		if (this.size == this.maxLength) this.deleteOldest();
		super.set(key, value);
	}
}