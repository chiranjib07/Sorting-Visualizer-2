let array = [];
let isSorting = false;

// DOM refs
const arraySizeInput = document.getElementById('arraySize');
const arrayInput = document.getElementById('arrayInput');
const algorithmSelect = document.getElementById('algorithmSelect');
const orderSelect = document.getElementById('orderSelect');
const generateBtn = document.getElementById('generateBtn');
const sortBtn = document.getElementById('sortBtn');
const visualization = document.getElementById('visualization');
const pseudocode = document.getElementById('pseudocode');

// ---------------- GENERATE ARRAY ----------------
generateBtn.addEventListener('click', () => {
  const size = parseInt(arraySizeInput.value);
  if (!size || size < 1) { alert("Enter valid size"); return; }
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  arrayInput.value = array.join(', ');
  renderArray(array);
  showPseudocode();
});

// ---------------- RENDER ARRAY ----------------
function renderArray(arr, highlightIdx = []) {
  visualization.innerHTML = '';
  arr.forEach((val, idx) => {
    const item = document.createElement('div');
    item.className = 'array-item';
    item.textContent = val;
    if (highlightIdx.includes(idx)) item.classList.add('highlight');
    visualization.appendChild(item);
  });
}

// ---------------- PSEUDOCODE ----------------
function showPseudocode() {
  const algo = algorithmSelect.value;
  const codes = {
    bubble: `for i = 0 to n-1
  for j = 0 to n-i-1
    if arr[j] > arr[j+1]
      swap(arr[j], arr[j+1])`,
    insertion: `for i = 1 to n-1
  key = arr[i]
  j = i-1
  while j >=0 and arr[j] > key
    arr[j+1] = arr[j]
    j = j-1
  arr[j+1] = key`,
    selection: `for i = 0 to n-1
  minIndex = i
  for j = i+1 to n
    if arr[j] < arr[minIndex]
      minIndex = j
  swap(arr[i], arr[minIndex])`,
    merge: `mergeSort(arr):
  if length <= 1 return arr
  mid = length/2
  left = mergeSort(arr[0..mid])
  right = mergeSort(arr[mid..end])
  return merge(left,right)`,
    quick: `quickSort(arr):
  if length <= 1 return arr
  pivot = arr[last]
  left = elements < pivot
  right = elements >= pivot
  return quickSort(left) + pivot + quickSort(right)`
  };
  pseudocode.textContent = codes[algo] || '';
}

// ---------------- SORT ----------------
sortBtn.addEventListener('click', async () => {
  if (isSorting) return;
  const raw = arrayInput.value.trim();
  if (!raw) { alert("Enter numbers or generate array first"); return; }
  array = raw.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  renderArray(array);
  showPseudocode();
  isSorting = true;

  const algo = algorithmSelect.value;
  const order = orderSelect.value;

  switch (algo) {
    case 'bubble': await bubbleSort(order); break;
    case 'insertion': await insertionSort(order); break;
    case 'selection': await selectionSort(order); break;
    case 'merge': array = await mergeSort(array, order); renderArray(array); break;
    case 'quick': array = await quickSort(array, order); renderArray(array); break;
  }

  isSorting = false;
});

// ---------------- HELPERS ----------------
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

async function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
  renderArray(arr, [i,j]);
  await sleep(200);
}

// ---------------- ALGORITHMS ----------------
async function bubbleSort(order) {
  for (let i = 0; i < array.length-1; i++) {
    for (let j = 0; j < array.length-i-1; j++) {
      if ((order === 'asc' && array[j] > array[j+1]) || (order === 'desc' && array[j] < array[j+1])) {
        await swap(array, j, j+1);
      }
    }
  }
  renderArray(array);
}

async function insertionSort(order) {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i-1;
    while (j>=0 && ((order==='asc' && array[j]>key) || (order==='desc' && array[j]<key))) {
      array[j+1] = array[j];
      renderArray(array, [j,j+1]);
      await sleep(200);
      j--;
    }
    array[j+1] = key;
    renderArray(array, [j+1]);
    await sleep(200);
  }
}

async function selectionSort(order) {
  for (let i=0; i<array.length; i++) {
    let idx = i;
    for (let j=i+1; j<array.length; j++) {
      if ((order==='asc' && array[j]<array[idx]) || (order==='desc' && array[j]>array[idx])) idx = j;
      renderArray(array, [i, j]);
      await sleep(150);
    }
    if (i!==idx) await swap(array, i, idx);
  }
}

async function mergeSort(arr, order) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length/2);
  const left = await mergeSort(arr.slice(0,mid), order);
  const right = await mergeSort(arr.slice(mid), order);
  return merge(left,right,order);
}

function merge(left,right,order){
  let res=[],i=0,j=0;
  while(i<left.length && j<right.length){
    if((order==='asc' && left[i]<right[j])||(order==='desc' && left[i]>right[j])){
      res.push(left[i++]);
    }else res.push(right[j++]);
  }
  return res.concat(left.slice(i)).concat(right.slice(j));
}

async function quickSort(arr, order) {
  if (arr.length<=1) return arr;
  const pivot = arr[arr.length-1];
  const left = arr.filter(x=>order==='asc'? x<pivot:x>pivot);
  const right = arr.filter(x=>order==='asc'? x>=pivot:x<=pivot);
  return (await quickSort(left,order)).concat(pivot, await quickSort(right,order));
}
