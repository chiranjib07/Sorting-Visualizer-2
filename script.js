let array = [];
let sorting = false;

function renderArray() {
  const container = document.getElementById("visualization");
  container.innerHTML = "";
  array.forEach(num => {
    const div = document.createElement("div");
    div.classList.add("array-item");
    div.textContent = num;
    container.appendChild(div);
  });
}

function shuffleArray() {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  renderArray();
}

function resetVisualizer() {
  array = [];
  document.getElementById("arrayInput").value = "";
  document.getElementById("pseudocode").textContent = "";
  document.getElementById("visualization").innerHTML = "";
}

function highlight(indices, className) {
  const items = document.querySelectorAll(".array-item");
  indices.forEach(i => {
    if (items[i]) items[i].classList.add(className);
  });
}

function clearHighlights() {
  document.querySelectorAll(".array-item").forEach(el => {
    el.classList.remove("highlight", "swap");
  });
}

function showPseudocode(algo) {
  const code = {
    bubble: `for i in 0..n-1:
  for j in 0..n-i-2:
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])`,

    insertion: `for i in 1..n-1:
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key:
    arr[j+1] = arr[j]
    j--
  arr[j+1] = key`,

    selection: `for i in 0..n-2:
  minIndex = i
  for j in i+1..n-1:
    if arr[j] < arr[minIndex]:
      minIndex = j
  swap(arr[i], arr[minIndex])`,

    merge: `function mergeSort(arr):
  if length <= 1: return arr
  mid = n/2
  left = mergeSort(arr[0..mid])
  right = mergeSort(arr[mid+1..n])
  return merge(left, right)`,

    quick: `function quickSort(arr, low, high):
  if low < high:
    p = partition(arr, low, high)
    quickSort(arr, low, p-1)
    quickSort(arr, p+1, high)`
  };
  document.getElementById("pseudocode").textContent = code[algo] || "";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// -------------------- Sorting Algorithms --------------------

async function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      clearHighlights();
      highlight([j, j+1], "highlight");
      await sleep(400);
      if (array[j] > array[j+1]) {
        highlight([j, j+1], "swap");
        await sleep(300);
        [array[j], array[j+1]] = [array[j+1], array[j]];
        renderArray();
        await sleep(300);
      }
    }
    document.querySelectorAll(".array-item")[array.length - i - 1].classList.add("sorted");
  }
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      clearHighlights();
      highlight([j, j+1], "swap");
      array[j+1] = array[j];
      j--;
      renderArray();
      await sleep(400);
    }
    array[j+1] = key;
    renderArray();
  }
  document.querySelectorAll(".array-item").forEach(el => el.classList.add("sorted"));
}

async function selectionSort() {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      clearHighlights();
      highlight([minIndex, j], "highlight");
      await sleep(300);
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      highlight([i, minIndex], "swap");
      await sleep(300);
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      renderArray();
      await sleep(300);
    }
    document.querySelectorAll(".array-item")[i].classList.add("sorted");
  }
  document.querySelectorAll(".array-item")[array.length - 1].classList.add("sorted");
}

async function mergeSortHelper(l, r) {
  if (l >= r) return;
  const m = Math.floor((l + r) / 2);
  await mergeSortHelper(l, m);
  await mergeSortHelper(m + 1, r);
  await merge(l, m, r);
}

async function merge(l, m, r) {
  const left = array.slice(l, m + 1);
  const right = array.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    clearHighlights();
    highlight([k], "highlight");
    await sleep(300);
    if (left[i] <= right[j]) {
      array[k++] = left[i++];
    } else {
      array[k++] = right[j++];
    }
    renderArray();
    await sleep(300);
  }
  while (i < left.length) array[k++] = left[i++];
  while (j < right.length) array[k++] = right[j++];
  renderArray();
}

async function mergeSort() {
  await mergeSortHelper(0, array.length - 1);
  document.querySelectorAll(".array-item").forEach(el => el.classList.add("sorted"));
}

async function quickSortHelper(low, high) {
  if (low < high) {
    let p = await partition(low, high);
    await quickSortHelper(low, p - 1);
    await quickSortHelper(p + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low;
  for (let j = low; j < high; j++) {
    clearHighlights();
    highlight([j, high], "highlight");
    await sleep(300);
    if (array[j] < pivot) {
      highlight([i, j], "swap");
      [array[i], array[j]] = [array[j], array[i]];
      renderArray();
      await sleep(300);
      i++;
    }
  }
  highlight([i, high], "swap");
  [array[i], array[high]] = [array[high], array[i]];
  renderArray();
  await sleep(300);
  return i;
}

async function quickSort() {
  await quickSortHelper(0, array.length - 1);
  document.querySelectorAll(".array-item").forEach(el => el.classList.add("sorted"));
}

// -------------------- Control --------------------

function startSort() {
  if (sorting) return;
  const input = document.getElementById("arrayInput").value.trim();
  if (!input) return alert("Enter numbers first.");

  array = input.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
  renderArray();
  const algo = document.getElementById("algorithmSelect").value;
  showPseudocode(algo);
  sorting = true;

  let promise;
  if (algo === "bubble") promise = bubbleSort();
  else if (algo === "insertion") promise = insertionSort();
  else if (algo === "selection") promise = selectionSort();
  else if (algo === "merge") promise = mergeSort();
  else if (algo === "quick") promise = quickSort();

  promise.then(() => sorting = false);
}
