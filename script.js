function startSort() {
  const arrayInput = document.getElementById('arrayInput').value;
  const algorithm = document.getElementById('algorithmSelect').value;

  const arr = arrayInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));

  if (arr.length === 0) {
    alert("Please enter valid numbers.");
    return;
  }

  fetch('/sort', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({array: arr, algorithm})
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('pseudocode').innerText = data.pseudo;
    animateSteps(data.steps);
  });
}

function animateSteps(steps) {
  let index = 0;
  const visualization = document.getElementById('visualization');

  function showStep() {
    visualization.innerHTML = '';
    const current = steps[index];

    current.array.forEach((num, idx) => {
      const div = document.createElement('div');
      div.className = 'array-item';
      div.textContent = num;

      if (current.highlight && current.highlight.includes(idx)) {
        div.classList.add('highlight');
      }

      visualization.appendChild(div);
    });

    index++;
    if (index < steps.length) {
      setTimeout(showStep, 400);
    }
  }

  showStep();
}
