// script.js

// Calculate SEC-DED Hamming code
function calculateHamming(dataBits) {
  const m = dataBits.length;
  let r = 0;
  while ((2 ** r) < m + r + 1) r++;
  const total = m + r;
  const arr = Array(total).fill(0);

  // Place data bits
  for (let i = 0, j = 1; j <= total; j++) {
    if ((j & (j - 1)) !== 0) arr[j - 1] = +dataBits[i++];
  }

  // Calculate parity bits
  for (let i = 0; i < r - 1; i++) {
    const p = 2 ** i;
    let sum = 0;
    for (let j = 1; j <= total; j++) {
      if ((j & p) !== 0) sum ^= arr[j - 1];
    }
    arr[p - 1] = sum;
  }

  // Overall parity bit
  arr[total - 1] = arr.reduce((a, b) => a ^ b, 0);
  return arr;
}

// Compute syndrome and correct single error
function syndromeAndCorrect(arr) {
  const total = arr.length;
  let r = 0;
  while ((2 ** r) < total + 1) r++;
  let syn = 0;

  // Parity checks
  for (let i = 0; i < r - 1; i++) {
    const p = 2 ** i;
    let sum = 0;
    for (let j = 1; j <= total; j++) {
      if ((j & p) !== 0) sum ^= arr[j - 1];
    }
    if (sum) syn += p;
  }

  // Overall parity
  const overall = arr.reduce((a, b) => a ^ b, 0);
  if (overall) syn += total;

  if (syn > 0 && syn <= total) arr[syn - 1] ^= 1;
  return syn;
}

let encoded = [];

// UI handlers
const genBtn = document.getElementById('genBtn');
const injectBtn = document.getElementById('injectBtn');
const showBitsBtn = document.getElementById('showBitsBtn');
const grid = document.getElementById('bitVisualization');

genBtn.onclick = () => {
  const len = +document.querySelector('input[name=len]:checked').value;
  const data = document.getElementById('dataInput').value.trim();
  if (!/^[01]+$/.test(data) || data.length !== len) {
    alert(`Please enter a ${len}-bit binary number.`);
    return;
  }
  encoded = calculateHamming(data);
  document.getElementById('hammingCodeOutput').innerText =
    `Hamming code (${len}+r):\n${encoded.join('')}`;
  document.getElementById('resultOutput').innerText = '';
  renderGrid();
  grid.style.display = 'none';
};

injectBtn.onclick = () => {
  if (!encoded.length) { alert('Generate code first!'); return; }
  const pos = +document.getElementById('errorPos').value;
  if (pos < 1 || pos > encoded.length) {
    alert('Invalid bit position.');
    return;
  }
  // Inject error
  encoded[pos - 1] ^= 1;
  // Correct error
  const syn = syndromeAndCorrect(encoded);
  document.getElementById('resultOutput').innerText =
    `Corrupted & corrected:\n${encoded.join('')}\nSyndrome: ${syn}`;
  renderGrid(pos, syn);
  grid.style.display = 'block';
};

// Toggle bit visualization visibility
showBitsBtn.onclick = () => {
  grid.style.display = grid.style.display === 'block' ? 'none' : 'block';
};

// Render the bit grid dynamically
function renderGrid(flipPos = null, synPos = null) {
  if (!encoded.length) {
    grid.innerHTML = '';
    return;
  }
  const total = encoded.length;
  let html = '';

  // Top row: bit positions
  html += '<div class="bit-row">';
  for (let i = total; i >= 1; i--) {
    const sel = i === synPos ? ' selected' : '';
    html += `<div class="bit-cell${sel}">${i}</div>`;
  }
  html += '</div>';

  // Bottom row: bit values
  html += '<div class="bit-row">';
  for (let i = total; i >= 1; i--) {
    let cls = '';
    if (i === flipPos) cls = ' error';
    if (i === synPos) cls += ' selected';
    html += `<div class="bit-cell${cls}">${encoded[i - 1]}</div>`;
  }
  html += '</div>';

  grid.innerHTML = html;
}
