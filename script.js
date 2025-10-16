// Sorting Visualizer - all algorithms with order support
// Save as script.js and open index.html

let currentArray = [];
let isSorting = false;

// DOM refs
const arraySizeInput = document.getElementById('arraySize');
const generateBtn = document.getElementById('generateBtn');
const arrayInput = document.getElementById('arrayInput');
const algorithmSelect = document.getElementById('algorithmSelect');
const orderSelect = document.getElementById('orderSelect');
const sortBtn = document.getElementById('sortBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const resetBtn = document.getElementById('resetBtn');
const visualization = document.getElementById('visualization');
const pseudocode = document.getElementById('pseudocode');

generateBtn.addEventListener('click', () => {
  const size = parseInt(arraySizeInput.value, 10);
  if (!size || size < 1) {
    alert('Enter a valid size (>=1)');
    return;
  }
  const arr = Array.from({length: size}, () => Math.floor(Math.random() * 100));
  arrayInput.value = arr.join(', ');
  createArrayElements(arr);
});

shuffleBtn.addEventListener('click', () => {
  if (!currentArray.length) return;
  shuffle(currentArray);
  renderArray(currentArray);
});

resetBtn.addEventListener('click', resetAll);

sortBtn.addEventListener('click', () => {
  if (isSorting) return;
  startSort();
});

// utilities
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// create DOM boxes from array (also updates currentArray)
function createArrayElements(arr) {
  currentArray = arr.slice();
  renderArray(currentArray);
  showPseudoForSelected();
}

function renderArray(arr, highlightIdxs = []) {
  visualization.innerHTML = '';
  arr.forEach((val, idx) => {
    const el = document.createElement('div');
    el.className = 'array-item';
    el.textContent = val;
    if (highlightIdxs.includes(idx)) el.classList.add('highlight');
    visualization.appendChild(el);
  });
}

// update DOM texts only (used by some algorithms after mutation)
function updateDOM(arr, highlightIdxs = []) {
  const nodes = visualization.querySelectorAll('.array-item');
  arr.forEach((v, i) => {
    if (nodes[i]) nodes[i].textContent = v;
    nodes[i]?.classList.remove('highlight','swap','sorted');
    if (highlightIdxs.includes(i)) nodes[i]?.classList.add('highlight');
  });
}

// mark final sorted
function markSorted() {
  const nodes = visualization.querySelectorAll('.array-item');
  nodes.forEach(n => { n.classList.remove('highlight','swap'); n.classList.add('sorted'); });
}

// swap animation helper (visual swap by updating text + momentary class)
async function doSwap(arr, i, j) {
  // swap values
  [arr[i], arr[j]] = [arr[j], arr[i]];
  // briefly show swap class on the two nodes and update text
  updateDOM(arr, [i, j]);
  const nodes = visualization.querySelectorAll('.array-item');
  if (nodes[i]) nodes[i].classList.add('swap');
  if (nodes[j]) nodes[j].classList.add('swap');
  await sleep(220);
  if (nodes[i]) nodes[i].classList.remove('swap');
  if (nodes[j]) nodes[j].classList.remove('swap');
}

// pseudocode display
function showPseudoForSelected() {
  const algo = algorithmSelect.value;
  const code = {
    bubble: `for i = 0 to n-1:
  for j = 0 to n-i-2:
    if compare(A[j], A[j+1]):
      swap(A[j], A[j+1])`,
    insertion: `for i = 1 to n-1:
  key = A[i]
  j = i-1
  while compare(A[j], key):
    A[j+1] = A[j]
    j = j-1
  A[j+1] = key`,
    selection: `for i = 0 to n-2:
  min = i
  for j = i+1 to n-1:
    if compare(A[j], A[min]):
      min = j
  swap(A[i], A[min])`,
    merge: `mergeSort(A):
  if length(A) > 1:
    mid = len/2
    mergeSort(left)
    mergeSort(right)
    merge(left,right)`,
    quick: `quickSort(A, low, high):
  if low < high:
    p = partition(A, low, high)
    quickSort(A, low, p-1)
    quickSort(A, p+1, high)`
  };
  pseudocode.textContent = code[algo] || '';
}

// comparison helper depending on order
function compare(a, b, order) {
  return order === 'asc' ? (a > b) : (a < b);
}

/* -------------------- Algorithms -------------------- */
/* All algorithms operate on currentArray and call updateDOM/doSwap where necessary.
   They respect 'order' (asc/desc). */

async function bubbleSort(order) {
  const n = currentArray.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      updateDOM(currentArray, [j, j+1]);
      await sleep(160);
      if (compare(currentArray[j], currentArray[j+1], order)) {
        await doSwap(currentArray, j, j+1);
      }
    }
  }
  markSorted();
}

async function insertionSort(order) {
  for (let i = 1; i < currentArray.length; i++) {
    let key = currentArray[i];
    let j = i - 1;
    while (j >= 0 && compare(currentArray[j], key, order)) {
      currentArray[j + 1] = currentArray[j];
      updateDOM(currentArray, [j, j+1]);
      await sleep(180);
      j--;
    }
    currentArray[j + 1] = key;
    updateDOM(currentArray, [j+1]);
    await sleep(160);
  }
  markSorted();
}

async function selectionSort(order) {
  const n = currentArray.length;
  for (let i = 0; i < n - 1; i++) {
    let target = i;
    for (let j = i + 1; j < n; j++) {
      updateDOM(currentArray, [target, j]);
      await sleep(160);
      if (compare(currentArray[target], currentArray[j], order)) {
        target = j;
        updateDOM(currentArray, [target, j]);
        await sleep(120);
      }
    }
    if (target !== i) await doSwap(currentArray, i, target);
  }
  markSorted();
}

async function mergeSortMain(order) {
  async function mergeSortRec(l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    await mergeSortRec(l, m);
    await mergeSortRec(m + 1, r);
    await merge(l, m, r);
  }
  async function merge(l, m, r) {
    const left = currentArray.slice(l, m + 1);
    const right = currentArray.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      updateDOM(currentArray, [k]);
      await sleep(160);
      if (!compare(left[i], right[j], order)) { // left <= right for asc
        currentArray[k++] = left[i++];
      } else {
        currentArray[k++] = right[j++];
      }
      updateDOM(currentArray, [k-1]);
      await sleep(140);
    }
    while (i < left.length) { currentArray[k++] = left[i++]; updateDOM(currentArray); await sleep(90); }
    while (j < right.length) { currentArray[k++] = right[j++]; updateDOM(currentArray); await sleep(90); }
  }
  await mergeSortRec(0, currentArray.length - 1);
  markSorted();
}

async function quickSortMain(order) {
  async function qsort(low, high) {
    if (low >= high) return;
    const p = await partition(low, high);
    await qsort(low, p - 1);
    await qsort(p + 1, high);
  }
  async function partition(low, high) {
    const pivot = currentArray[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      updateDOM(currentArray, [j, high]);
      await sleep(160);
      if (!compare(currentArray[j], pivot, order)) { // currentArray[j] <= pivot for asc
        i++;
        await doSwap(currentArray, i, j);
      }
    }
    await doSwap(currentArray, i + 1, high);
    return i + 1;
  }
  await qsort(0, currentArray.length - 1);
  markSorted();
}

/* -------------------- Control / Start / Reset -------------------- */

function startSort() {
  const raw = arrayInput.value.trim();
  if (!raw) { alert('Enter numbers or generate first.'); return; }
  const arr = raw.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
  if (arr.length < 1) { alert('Enter at least 1 number.'); return; }
  currentArray = arr.slice();
  renderArray(currentArray);
  showPseudoForSelected();
  runSelectedAlgorithm();
}

function showPseudoForSelected() {
  const a = algorithmSelect.value;
  const map = {
    bubble: 'Bubble Sort pseudocode shown',
    insertion: 'Insertion Sort pseudocode shown',
    selection: 'Selection Sort pseudocode shown',
    merge: 'Merge Sort pseudocode shown',
    quick: 'Quick Sort pseudocode shown'
  };
  // We also reuse earlier implemented pseudo text if you prefer more verbose code
  pseudocode.textContent = map[a];
}

async function runSelectedAlgorithm() {
  if (isSorting) return;
  isSorting = true;
  const algo = algorithmSelect.value;
  const order = orderSelect.value;

  try {
    if (algo === 'bubble') await bubbleSort(order);
    else if (algo === 'insertion') await insertionSort(order);
    else if (algo === 'selection') await selectionSort(order);
    else if (algo === 'merge') await mergeSortMain(order);
    else if (algo === 'quick') await quickSortMain(order);
  } finally {
    isSorting = false;
  }
}

function resetAll() {
  currentArray = [];
  arrayInput.value = '';
  arraySizeInput.value = '';
  visualization.innerHTML = '';
  pseudocode.textContent = '';
  isSorting = false;
}
