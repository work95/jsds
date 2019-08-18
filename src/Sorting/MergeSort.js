/* Merge Sort Implementation. */

module.exports = function (list) {
	mergeSort(list, 0, list.length - 1);
}

/**
 *
 * @param list {array} - List of elements to sort.
 * @param low {int} - Lowest index of the list. 
 * @param high {int} - Highest index of the list. 
 *
 * @return undefined 
 */
function mergeSort(list, low, high) {
	if (low < high) {
		
		/*
		 * Find the middle element index. 
		 * Using floor function for fraction values.
		 */

		let mid = Math.floor((low + high) / 2);
		mergeSort(list, low, mid);					// Divide left sub-array.
		mergeSort(list, (mid + 1), high);		// Divide right sub-array.
		merge(list, low, mid, high);				// Merge the two.
	}
}

/**
 * Merges two sub-arrays after sorting them in ascending order. 
 *
 * @param list {array} - List containing the two sub-arrays. 
 * @param low {int} - Lowest index of the list. 
 * @param mid {int} - Middle index of the list.
 * @param high {int} - Highest index of the list. 
 * 
 * @return undefined.
 */
function merge(list, low, mid, high) {
	let n1 = mid - low + 1;
	let n2 = high - mid;

	let L = new Array();		// Left sub-array.
	let R = new Array();		// Right sub-array.

	for (let i = 0; i < n1; i++) {
		L[i] = list[low + i];			// Fill up left sub-array.
	}

	for (let i = 0; i < n2; i++) {
		R[i] = list[mid + 1 + i];		 // Fill up right sub-array.
	}

	let i = 0;				// Index for left sub-array.
	let j = 0;				// Index for right sub-array.
	let k = low;			// Index for the modified array.

	// Run till either of the two sub-array exhausts.
	while (i < n1 && j < n2) {
		/*
		 * Compare the two sub-array elements, 
		 * and place them in ascending order.
		 */

		if (L[i] <= R[j]) { 
			list[k++] = L[i++]; 
		} else { 
			list[k++] = R[j++]; 
		}
	}

	/* Fill in the remaining elements of the sub-array, if any.*/

	while (i < n1) { 
		list[k++] = L[i++]; 
	}

	while (j < n2) { 
		list[k++] = R[j++]; 
	}
}
