/* Recursive implementation of the QuickSort algorithm. */

module.exports = function (list) {
	quickSort(list, 0, list.length - 1);
}

/**
 *
 * @param list {array} - List of elements to sort.
 * @param low {int} - Lowest index of the array of elements.
 * @param high {int} - Highest index of the array of elements.
 *
 * @return undefined.
 */
function quickSort(list, low, high) {
	if (low < high) {
		let q = partition(list, low, high);
		quickSort(list, low, q - 1);
		quickSort(list, q + 1, high);
	}
}

/** 
 * Partition the array of elements into two 
 * sub-arrays whereby each element in the 
 * first sub-array is smaller than each 
 * element of the second sub-array.
 *
 * @param list {array} - List of elements.
 * @param low {int} - Lowest index of the array of elements.
 * @param high {int} - Highest index of the array of elements.
 *
 * @return {int} - position of pivot.
 */
function partition(list, low, high) {
	// Pivot is the last element of the list.
	let x = list[high];
	let i = low - 1;
	for (let j = low; j < high; j++) {
		if (list[j] <= x) {
			i++;
			swap(list, i, j);
		}
	}
	swap(list, (i + 1), high);

	return i + 1;
}

/** 
 * To swap two elements in a list.
 * 
 * @param list {array} - list of elements.
 * @param iA {int} - index of first element.
 * @param iB {int} - index of second element.
 *
 * @return undefined.
 */
function swap(list, iA, iB) {
	let temp = list[iA];
	list[iA] = list[iB];
	list[iB] = temp;
}
