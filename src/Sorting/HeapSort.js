var A;
heapSize = 0;

function maxHeapify(A, i) {
  let l = left(i);
  let r = right(i);
  let largest;

  if (l < heapSize && A[l] > A[i]) {
    largest = l;
  } else {
    largest = i;
  }

  if (r < heapSize && A[r] > A[largest]) {
    largest = r;
  }

  if (largest !== i) {
    swap(A, i, largest);
    maxHeapify(A, largest);
  }
}

function left(i) {
  return 2 * i + 1;
}

function right(i) {
  return 2 * i + 2;
}

function parent(i) {
  return Math.ceil(i / 2) - 1;
}

function buildMaxHeap(A) {
  heapSize = A.length;
  for (let i = Math.floor(A.length / 2) - 1; i >= 0; i--) {
    maxHeapify(A, i);
  }
}

function HeapSort(A) {
  buildMaxHeap(A);
  for (let i = A.length - 1; i >= 0; i--) {
    swap(A, 0, i);
    heapSize--;
    maxHeapify(A, 0);
  }
}

function swap(list, a, b) {
  let temp = list[a];
  list[a] = list[b];
  list[b] = temp;
}

module.exports = function (list) {
  HeapSort(list);
}
