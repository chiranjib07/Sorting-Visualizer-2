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
  swap(arr[i], arr[minIndex])`
  };
  document.getElementById("pseudocode").textContent = code[algo] || "";
}

async function bubbleSort() {
  const items = document.querySelectorAll(".array-item");
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      clearHighlights();
      highlight([j, j+1], "highlight");
      await new Promise(res => setTimeout(res, 500));
      if (array[j] > array[j + 1]) {
        highlight([j, j+1], "swap");
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        renderArray();
      }
      await new Promise(res => setTimeout(res, 400));
    }
    document.querySelectorAll(".array-item")[array.length - i - 1].classList.add("sorted");
  }
}

function startSort() {
  if (sorting) return;
  const input = document.getElementById("arrayInput").value.trim();
  if (!input) return alert("Enter numbers first.");

  array = input.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
  renderArray();
  const algo = document.getElementById("algorithmSelect").value;
  showPseudocode(algo);
  sorting = true;

  if (algo === "bubble") bubbleSort().then(() => sorting = false);
  else alert("Only Bubble Sort animated for now. Others can be added similarly.");
}
