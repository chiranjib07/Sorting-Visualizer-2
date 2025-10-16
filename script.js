let elements = [];
let speed = 400;

function changeSpeed() {
  const speedSelect = document.getElementById("speedSelect");
  speed = parseInt(speedSelect.value);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createArray(arr) {
  const container = document.getElementById("visualization");
  container.innerHTML = "";
  elements = [];

  arr.forEach((num, index) => {
    const el = document.createElement("div");
    el.classList.add("array-item");
    el.innerText = num;
    el.style.transform = `translateX(${index * 60}px)`;
    container.appendChild(el);
    elements.push(el);
  });
}

function showPseudocode(algorithm) {
  const code = {
    bubble: `for i = 0 to n-1:
  for j = 0 to n-i-1:
    if A[j] > A[j+1]:
      swap(A[j], A[j+1])`,

    insertion: `for i = 1 to n-1:
  key = A[i]
  j = i - 1
  while j >= 0 and A[j] > key:
    A[j+1] = A[j]
    j = j - 1
  A[j+1] = key`,

    selection: `for i = 0 to n-1:
  minIndex = i
  for j = i+1 to n-1:
    if A[j] < A[minIndex]:
      minIndex = j
  swap(A[i], A[minIndex])`
  };
  document.getElementById("pseudocode").innerText = code[algorithm];
}

async function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      elements[j].classList.add("highlight");
      elements[j+1].classList.add("highlight");
      await sleep(speed);

      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        const temp = elements[j].style.transform;
        elements[j].style.transform = elements[j+1].style.transform;
        elements[j+1].style.transform = temp;
        elements[j].classList.add("swap");
        elements[j+1].classList.add("swap");
        [elements[j], elements[j+1]] = [elements[j+1], elements[j]];
        await sleep(speed);
        elements[j].classList.remove("swap");
        elements[j+1].classList.remove("swap");
      }

      elements[j].classList.remove("highlight");
      elements[j+1].classList.remove("highlight");
    }
    elements[n - i - 1].classList.add("sorted");
  }
  elements[0].classList.add("sorted");
}

async function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    elements[i].classList.add("highlight");
    await sleep(speed);

    while (j >= 0 && arr[j] > key) {
      elements[j].classList.add("highlight");
      await sleep(speed);
      arr[j + 1] = arr[j];

      const temp = elements[j+1].style.transform;
      elements[j+1].style.transform = elements[j].style.transform;
      elements[j].style.transform = temp;

      [elements[j+1], elements[j]] = [elements[j], elements[j+1]];
      j--;
    }
    arr[j + 1] = key;

    elements.forEach(el => el.classList.remove("highlight"));
  }
  elements.forEach(el => el.classList.add("sorted"));
}

async function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    elements[minIndex].classList.add("highlight");

    for (let j = i + 1; j < arr.length; j++) {
      elements[j].classList.add("highlight");
      await sleep(speed);
      if (arr[j] < arr[minIndex]) {
        elements[minIndex].classList.remove("highlight");
        minIndex = j;
        elements[minIndex].classList.add("highlight");
      }
      elements[j].classList.remove("highlight");
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      const temp = elements[i].style.transform;
      elements[i].style.transform = elements[minIndex].style.transform;
      elements[minIndex].style.transform = temp;
      elements[i].classList.add("swap");
      elements[minIndex].classList.add("swap");
      [elements[i], elements[minIndex]] = [elements[minIndex], elements[i]];
      await sleep(speed);
      elements[i].classList.remove("swap");
      elements[minIndex].classList.remove("swap");
    }

    elements[i].classList.remove("highlight");
    elements[i].classList.add("sorted");
  }
  elements[elements.length - 1].classList.add("sorted");
}

function startSort() {
  const input = document.getElementById("arrayInput").value.trim();
  if (!input) return;
  const arr = input.split(",").map(Number);
  createArray(arr);

  const algorithm = document.getElementById("algorithmSelect").value;
  showPseudocode(algorithm);

  if (algorithm === "bubble") bubbleSort(arr);
  if (algorithm === "insertion") insertionSort(arr);
  if (algorithm === "selection") selectionSort(arr);
}
