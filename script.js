function generateArray() {
  const size = parseInt(document.getElementById('arraySize').value);
  const container = document.getElementById('dynamicInputs');
  container.innerHTML = '';

  for (let i = 0; i < size; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = `Element ${i + 1}`;
    input.classList.add('array-input');
    container.appendChild(input);
  }
}

function getArray() {
  const inputs = document.querySelectorAll('.array-input');
  const arr = [];
  inputs.forEach(inp => {
    const val = parseInt(inp.value);
    if (!isNaN(val)) arr.push(val);
  });
  return arr;
}

function displayArray(arr, highlights = []) {
  const container = document.getElementById('visualization');
  container.innerHTML = '';
  arr.forEach((num, i) => {
    const div = document.createElement('div');
    div.classList.add('array-item');
    div.textContent = num;
    if (highlights.includes(i)) {
      div.classList.add('highlight');
    }
    container.appendChild(div);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ✅ Bubble Sort
async function bubbleSort(arr, order) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      displayArray(arr, [j, j + 1]);
      await delay(400);
      if ((order === 'asc' && arr[j] > arr[j + 1]) ||
          (order === 'desc' && arr[j] < arr[j + 1])) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        displayArray(arr, [j, j + 1]);
        await delay(400);
      }
    }
  }
  displayArray(arr);
}

// ✅ Insertion Sort
async function insertionSort(arr, order) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && (
      (order === 'asc' && arr[j] > key) ||
      (order === 'desc' && arr[j] < key)
    )) {
      arr[j + 1] = arr[j];
      j--;
      displayArray(arr, [j + 1, i]);
      await delay(400);
    }
    arr[j + 1] = key;
    displayArray(arr);
    await delay(400);
  }
}

// ✅ Selection Sort
async function selectionSort(arr, order) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let idx = i;
    for (let j = i + 1; j < n; j++) {
      displayArray(arr, [idx, j]);
      await delay(400);
      if ((order === 'asc' && arr[j] < arr[idx]) ||
          (order === 'desc' && arr[j] > arr[idx])) {
        idx = j;
      }
    }
    if (idx !== i) {
      [arr[i], arr[idx]] = [arr[idx], arr[i]];
      displayArray(arr, [i, idx]);
      await delay(400);
    }
  }
  displayArray(arr);
}

// ✅ Merge Sort
async function mergeSort(arr, order) {
  async function mergeSortHelper(start, end) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    await mergeSortHelper(start, mid);
    await mergeSortHelper(mid + 1, end);
    await merge(start, mid, end);
  }

  async function merge(start, mid, end) {
    let left = arr.slice(start, mid + 1);
    let right = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      displayArray(arr, [k]);
      await delay(400);
      if ((order === 'asc' && left[i] <= right[j]) ||
          (order === 'desc' && left[i] >= right[j])) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
    }

    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];

    displayArray(arr);
    await delay(400);
  }

  await mergeSortHelper(0, arr.length - 1);
  displayArray(arr);
}

// ✅ Quick Sort
async function quickSort(arr, order) {
  async function quickSortHelper(low, high) {
    if (low < high) {
      const pi = await partition(low, high);
      await quickSortHelper(low, pi - 1);
      await quickSortHelper(pi + 1, high);
    }
  }

  async function partition(low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      displayArray(arr, [j, high]);
