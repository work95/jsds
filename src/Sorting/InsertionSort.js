/* Insertion Sort Implementation. */


/**
 * 
 * @param list {array} - List of elements to sort. 
 * 
 * @param undefined.
 */
module.exports = function (list) {
	insertionSort(list);
}

/**
 * 
 * @param list {array} - List of elements to sort.
 *
 * @return undefined.
 */
function insertionSort(list) {
	for (let j = 1; j < list.length; j++) {
		let key = list[j];
		let i = j - 1;
		while (j > 0 && list[i] > key) {
			list[i + 1] = list[i];
			i--;
		}
		list[i + 1] = key;
	}
}
