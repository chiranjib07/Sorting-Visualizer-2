let array = [];

const arraySizeInput = document.getElementById('arraySize');
const arrayInput = document.getElementById('arrayInput');
const algorithmSelect = document.getElementById('algorithmSelect');
const orderSelect = document.getElementById('orderSelect');
const generateBtn = document.getElementById('generateBtn');
const sortBtn = document.getElementById('sortBtn');
const visualization = document.getElementById('visualization');
const pseudocode = document.getElementById('pseudocode');

generateBtn.addEventListener('click', () => {
  const size = parseInt(arraySizeInput.value);
  if (!size || size < 1) { alert("Enter valid size"); return; }
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  arrayInput.value = array.join(',');
  renderArray(array);
  showPseudocode();
});

sortBtn.addEventListener('click', async () => {
  const raw = arrayInput.value.trim();
  if (!raw) { alert("Enter numbers or generate first"); return; }
  array = raw.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  renderArray(array);
  showPseudocode();
  await bubbleSort(orderSelect.value); // for testing, only bubble
});

function renderArray(arr, highlightIdx=[]) {
  visualization.innerHTML = '';
  arr.forEach((val, idx) => {
    const item = document.createElement('div');
    item.className = 'array-item';
    item.textContent = val;
    if (highlightIdx.includes(idx)) item.classList.add('highlight');
    visualization.appendChild(item);
  });
}

function showPseudocode() {
  const algo = algorithmSelect.value;
  const codes = {
    bubble: `for i = 0 to n-1
  for j = 0 to n-i-1
    if arr[j] > arr[j+1]
      swap(arr[j], arr[j+1])`
  };
  pseudocode.textContent = codes[algo] || '';
}

function sleep(ms){ return new Promise(res => setTimeout(res, ms)); }

async function bubbleSort(order){
  for(let i=0;i<array.length-1;i++){
    for(let j=0;j<array.length-i-1;j++){
      if((order==='asc' && array[j]>array[j+1]) || (order==='desc' && array[j]<array[j+1])){
        [array[j], array[j+1]] = [array[j+1], array[j]];
        renderArray(array, [j,j+1]);
        await sleep(200);
      }
    }
  }
  renderArray(array);
}
