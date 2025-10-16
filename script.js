function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createArrayElements(array) {
  const container = document.getElementById("visualization");
  container.innerHTML = "";
  array.forEach((num) => {
    const div = document.createElement("div");
    div.classList.add("array-item");
    div.textContent = num;
    container.appendChild(div);
  });
}

function highlight(indexes) {
  const items = document.querySelectorAll(".array-item");
  indexes.forEach(i => items[i].classList.add("highlight"));
}

function removeHighlight(indexes) {
  const items = document.querySelectorAll(".array-item");
  indexes.forEach(i => items[i].classList.remove("highlight"));
}

function swapElements(i, j) {
  const container = document.getElementById("visualization");
  const items = container.querySelectorAll(".array-item");
  const tempText = items[i].textContent;
  items[i].textContent = items[j].textContent;
  items[j].textContent = tempText;
  items[i].classList.add("swap");
  items[j].classList.add("swap");
  setTimeout(() => {
    items[i].classList.remove("swap");
    items[j].classList.remove("swap");
  }, 600);
}

function showPseudocode(algorithm) {
  const pseudo = {
    bubble: `for i in 0..n-1:
  for j in 0..n-i-1:
    if A[j] > A[j+1]:
      swap(A[j], A[j+1])`,

    insertion: `for i in 1..n:
  key = A[i]
  j = i - 1
  while j >= 0 and A[j] > key:
    A[j+1] = A[j]
    j = j - 1
  A[j+1] = key`,

    selection: `for i in 0..n-1:
  minIndex = i
  for j in i+1..n:
    if A[j] < A[minIndex]:
      minIndex = j
  swap(A[i], A[minIndex])`,

    merge: `mergeSort(A):
  if length(A) > 1:
    mid = length(A)/2
    L = left half
    R = right half
    mergeSort(L)
    mergeSort(R)
    merge(L, R, A)`,

    quick: `quickSort(A):
  if length(A) <= 1:
    return
  pivot = A[last]
  partition array
  quickSort(left)
  quickSort(right)`
  };
  document.getElementById("pseudocode").textContent = pseudo[algorithm];
}

function updateElements(array) {
  const container = document.getElementById("visualization");
  const items = container.querySelectorAll(".array-item");
  array.forEach((val, i) => items[i].textContent = val);
}

function markSorted() {
  const items = document.querySelectorAll(".array-item");
  items.forEach(el => el.classList.add("sorted"));
}

function resetVisualization() {
  document.getElementById("arrayInput").value = "";
  document.getElementById("visualization").innerHTML = "";
  document.getElementById("pseudocode").textContent = "";
  document.getElementById("arraySize").value = "";
}

/* ---------- Sorting Algorithms ---------- */

async function bubbleSort(array, order) {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      highlight([j, j+1]);
      await sleep(400);
      if ((order === "asc" && array[j] > array[j + 1]) || 
          (order === "desc" && array[j] < array[j + 1])) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapElements(j, j+1);
        await sleep(400);
      }
      removeHighlight([j, j+1]);
    }
  }
  markSorted();
}

async function insertionSort(array, order) {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && ((order === "asc" && array[j] > key) || (order === "desc" && array[j] < key))) {
      highlight([j, j+1]);
      array[j+1] = array[j];
      swapElements(j, j+1);
      await sleep(400);
      removeHighlight([j, j+1]);
      j--;
    }
    array[j+1] = key;
  }
  markSorted();
}

async function selectionSort(array, order) {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    let target = i;
    for (let j = i+1; j < n; j++) {
      highlight([target, j]);
      await sleep(300);
      if ((order === "asc" && array[j] < array[target]) || (order === "desc" && array[j] > array[target])) {
        target = j;
      }
      removeHighlight([target, j]);
    }
    if (target !== i) {
      [array[i], array[target]] = [array[target], array[i]];
      swapElements(i, target);
      await sleep(400);
    }
  }
  markSorted();
}

async function mergeSort(array, left = 0, right = array.length - 1, order = "asc") {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSort(array, left, mid, order);
  await mergeSort(array, mid + 1, right, order);
  await merge(array, left, mid, right, order);
  if (left === 0 && right === array.length - 1) markSorted();
}

async function merge(array, left, mid, right, order) {
  let leftArr = array.slice(left, mid + 1);
  let rightArr = array.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;
  while (i < leftArr.length && j < rightArr.length) {
    highlight([k]);
    await sleep(300);
    if ((order === "asc" && leftArr[i] <= rightArr[j]) || (order === "desc" && leftArr[i] >= rightArr[j])) {
      array[k] = leftArr[i++];
    } else {
      array[k] = rightArr[j++];
    }
    updateElements(array);
    removeHighlight([k]);
    k++;
  }
  while (i < leftArr.length) { array[k++] = leftArr[i++]; updateElements(array); }
  while (j < rightArr.length) { array[k++] = rightArr[j++]; updateElements(array); }
}

async function quickSort(array, low = 0, high = array.length - 1, order = "asc") {
  if (low < high) {
    const pi = await partition(array, low, high, order);
    await quickSort(array, low, pi - 1, order);
    await quickSort(array, pi + 1, high, order);
  }
  if (low === 0 && high === array.length - 1) markSorted();
}

async function partition(array, low, high, order) {
  const pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    highlight([j, high]);
    await sleep(300);
    if ((order === "asc" && array[j] < pivot) || (order === "desc" && array[j] > pivot)) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      swapElements(i, j);
      await sleep(300);
    }
    removeHighlight([j, high]);
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  swapElements(i+1, high);
  await sleep(300);
  return i + 1;
}

/* ---------- UI Actions ---------- */

function generateArray() {
  const size = parseInt(document.getElementById("arraySize").value);
  if (isNaN(size) || size <= 0) return;

  let arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 100));
  }
  document.getElementById("arrayInput").value = arr.join(", ");
  createArrayElements(arr);
}

function startSort() {
  const array = document.getElementById("arrayInput").value
    .split(",")
    .map(x => parseInt(x.trim()))
    .filter(x => !isNaN(x));
  if (array.length === 0) return;

  const algorithm = document.getElementById("algorithmSelect").value;
  const order = document.getElementById("orderSelect").value;

  createArrayElements(array);
  showPseudocode(algorithm);

  switch (algorithm) {
    case "bubble": bubbleSort(array, order); break;
    case "insertion": insertionSort(array, order); break;
    case "selection": selectionSort(array, order); break;
    case "merge": mergeSort(array, 0, array.length - 1, order); break;
    case "quick": quickSort(array, 0, array.length - 1, order); break;
  }
}
