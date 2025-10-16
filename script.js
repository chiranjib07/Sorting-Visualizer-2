let array = [];

function generateArray() {
  const size = parseInt(document.getElementById('arraySize').value);
  const inputField = document.getElementById('arrayInput');
  if (size > 0) {
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    inputField.value = array.join(',');
    visualizeArray();
  }
}

function visualizeArray() {
  const visualization = document.getElementById('visualization');
  visualization.innerHTML = '';
  array.forEach(value => {
    const item = document.createElement('div');
    item.className = 'array-item';
    item.textContent = value;
    visualization.appendChild(item);
  });
}

function setPseudocode(algorithm) {
  const pseudocodeEl = document.getElementById('pseudocode');
  const pseudocodes = {
    bubble: `for i = 0 to n-1
  for j = 0 to n-i-1
    if arr[j] > arr[j+1]
      swap(arr[j], arr[j+1])`,

    insertion: `for i = 1 to n-1
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key
    arr[j+1] = arr[j]
    j = j - 1
  arr[j+1] = key`,

    selection: `for i = 0 to n-1
  minIndex = i
  for j = i+1 to n
    if arr[j] < arr[minIndex]
      minIndex = j
  swap(arr[i], arr[minIndex])`,

    merge: `function mergeSort(arr)
  if length <= 1 return arr
  mid = length/2
  left = mergeSort(arr[0..mid])
  right = mergeSort(arr[mid..end])
  return merge(left,right)`,

    quick: `function quickSort(arr)
  if length <= 1 return arr
  pivot = arr[last]
  left = elements < pivot
  right = elements >= pivot
  return quickSort(left)+pivot+quickSort(right)`
  };
  pseudocodeEl.textContent = pseudocodes[algorithm] || '';
}

async function startSort() {
  const algorithm = document.getElementById('algorithmSelect').value;
  const order = document.getElementById('orderSelect').value;
  setPseudocode(algorithm);

  switch (algorithm) {
    case 'bubble': await bubbleSort(order); break;
    case 'insertion': await insertionSort(order); break;
    case 'selection': await selectionSort(order); break;
    case 'merge': array = await mergeSort(array, order); visualizeArray(); break;
    case 'quick': array = await quickSort(array, order); visualizeArray(); break;
  }
}

function highlight(i, j) {
  const items = document.querySelectorAll('.array-item');
  items.forEach(item => item.classList.remove('highlight'));
  if (i !== null) items[i].classList.add('highlight');
  if (j !== null && j !== i) items[j].classList.add('highlight');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Sorting Algorithms with Animation
async function bubbleSort(order) {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      highlight(j, j + 1);
      await sleep(200);
      if ((order === 'asc' && array[j] > array[j + 1]) || 
          (order === 'desc' && array[j] < array[j + 1])) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        visualizeArray();
        highlight(j, j + 1);
        await sleep(200);
      }
    }
  }
  highlight(null, null);
}

async function insertionSort(order) {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && ((order === 'asc' && array[j] > key) || (order === 'desc' && array[j] < key))) {
      highlight(j, j + 1);
      array[j + 1] = array[j];
      visualizeArray();
      await sleep(200);
      j--;
    }
    array[j + 1] = key;
    visualizeArray();
    await sleep(200);
  }
  highlight(null, null);
}

async function selectionSort(order) {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    let idx = i;
    for (let j = i + 1; j < n; j++) {
      highlight(idx, j);
      await sleep(200);
      if ((order === 'asc' && array[j] < array[idx]) ||
          (order === 'desc' && array[j] > array[idx])) {
        idx = j;
      }
    }
    [array[i], array[idx]] = [array[idx], array[i]];
    visualizeArray();
    await sleep(200);
  }
  highlight(null, null);
}

async function mergeSort(arr, order) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = await mergeSort(arr.slice(0, mid), order);
  const right = await mergeSort(arr.slice(mid), order);
  return merge(left, right, order);
}

function merge(left, right, order) {
  let result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if ((order === 'asc' && left[i] < right[j]) || (order === 'desc' && left[i] > right[j])) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

async function quickSort(arr, order) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = arr.filter(x => (order === 'asc' ? x < pivot : x > pivot));
  const right = arr.filter(x => (order === 'asc' ? x >= pivot : x <= pivot));
  return (await quickSort(left, order)).concat(pivot, await quickSort(right, order));
}
