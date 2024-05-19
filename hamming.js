function calculateHammingCode(data, parityType) {
    let r = 0;
    while (Math.pow(2, r) < data.length + r + 1) {
        r++;
    }
    let hammingCode = new Array(data.length + r);
    let j = 0;
    let k = 0;
    let parityBitsPositions = [];

    for (let i = 1; i <= hammingCode.length; i++) {
        if (i === Math.pow(2, j)) {
            hammingCode[i - 1] = 0; // Parity bit placeholder
            parityBitsPositions.push(i); // Save the position (1-based)
            j++;
        } else {
            hammingCode[i - 1] = parseInt(data[k]); // Directly access the array index
            k++;
        }
    }

    let steps = `Initial Hamming Code with placeholders: ${hammingCode.join('')}\n`;

    for (let i = 0; i < r; i++) {
        let parity = 0;
        let parityPosition = Math.pow(2, i);
        for (let j = parityPosition - 1; j < hammingCode.length; j += 2 * parityPosition) {
            for (let k = 0; k < parityPosition && j + k < hammingCode.length; k++) {
                parity ^= hammingCode[j + k];
            }
        }
        if (parityType === 'odd') {
            parity = parity === 0 ? 1 : 0;
        }
        hammingCode[parityPosition - 1] = parity;
        steps += `Parity bit for position ${parityPosition} set to ${parity}\n`;
    }
    steps += `Final Hamming Code: ${hammingCode.join('')}\n`;

    return {
        hammingCode: hammingCode.join(''),
        parityBitsPositions: parityBitsPositions,
        steps: steps
    };
}

function calculateSyndrome(hammingCode, parityType) {
    let r = 0;
    while (Math.pow(2, r) < hammingCode.length + 1) {
        r++;
    }
    let syndrome = 0;
    let steps = `Received Hamming Code: ${hammingCode}\n`;

    for (let i = 0; i < r; i++) {
        let parity = 0;
        let parityPosition = Math.pow(2, i);
        for (let j = parityPosition - 1; j < hammingCode.length; j += 2 * parityPosition) {
            for (let k = 0; k < parityPosition && j + k < hammingCode.length; k++) {
                parity ^= parseInt(hammingCode[j + k]);
            }
        }
        if (parityType === 'odd') {
            parity = parity === 0 ? 1 : 0;
        }
        syndrome += parity * parityPosition;
        steps += `Calculated parity for position ${parityPosition}: ${parity}\n`;
    }
    steps += `Syndrome: ${syndrome}\n`;

    return {
        syndrome: syndrome,
        steps: steps
    };
}

function calculate() {
    const data = document.getElementById('bitData').value;
    const parityType = document.getElementById('parityType').value;
    const transferType = document.getElementById('transferType').value;

    if (data.length < 2 || data.length > 50) {
        alert("Data length must be between 2 and 50 bits.");
        return;
    }

    if (transferType === 'send') {
        let { hammingCode, steps } = calculateHammingCode(data, parityType);
        document.getElementById('output').innerText = `Data transferred is ${hammingCode}`;
        localStorage.setItem('steps', steps);
    } else if (transferType === 'receive') {
        let { syndrome, steps } = calculateSyndrome(data, parityType);
        let output = `Received Data: ${data}\nSyndrome: ${syndrome}\n`;
        if (syndrome === 0) {
            output += "The position of error is not found (no error detected)";
        } else {
            output += `The position of error is ${syndrome}`;
        }
        document.getElementById('output').innerText = output;
        localStorage.setItem('steps', steps);
    }
}


function showSteps() {
    const steps = localStorage.getItem('steps');
    const stepsOutput = document.getElementById('stepsOutput');
    stepsOutput.innerText = steps;
    stepsOutput.style.display = 'block';
}