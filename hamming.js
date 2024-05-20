function calculateHammingCode(data, parityType) {
    let r = 0;
    while (Math.pow(2, r) < data.length + r + 1) {
        r++;
    }
    let hammingCode = new Array(data.length + r);
    let j = 0;
    let k = 0;

    for (let i = 1; i <= hammingCode.length; i++) {
        if (i === Math.pow(2, j)) {
            hammingCode[i - 1] = 0; // Parity bit placeholder
            j++;
        } else {
            hammingCode[i - 1] = parseInt(data[k]); // Directly access the array index
            k++;
        }
    }

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
    }

    return hammingCode.join('');
}

function calculateSyndrome(hammingCode, parityType) {
    let r = 0;
    while (Math.pow(2, r) < hammingCode.length + 1) {
        r++;
    }
    let syndrome = 0;

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
    }

    return syndrome;
}

function introduceError(hammingCode) {
    const errorPosition = Math.floor(Math.random() * hammingCode.length);
    hammingCode = hammingCode.split('');
    hammingCode[errorPosition] = hammingCode[errorPosition] === '0' ? '1' : '0';
    return { hammingCode: hammingCode.join(''), errorPosition: errorPosition + 1 };
}

function calculate() {
    const data = document.getElementById('bitData').value;
    const parityType = document.getElementById('parityType').value;
    const transferType = document.getElementById('transferType').value;

    if (data.length !== 4 && data.length !== 8 && data.length !== 16) {
        alert("Data length must be 4, 8, or 16 bits.");
        return;
    }

    if (transferType === 'send') {
        let hammingCode = calculateHammingCode(data, parityType);
        document.getElementById('output').innerText = `Hamming Code: ${hammingCode}`;
        localStorage.setItem('hammingCode', hammingCode);
    } else if (transferType === 'receive') {
        let hammingCode = localStorage.getItem('hammingCode');
        let { hammingCode: erroredCode, errorPosition } = introduceError(hammingCode);
        let syndrome = calculateSyndrome(erroredCode, parityType);
        let output = `Received Hamming Code: ${erroredCode}\nSyndrome: ${syndrome}\n`;
        if (syndrome === 0) {
            output += "No error detected";
        } else {
            output += `Error detected at position ${syndrome}, originally introduced at position ${errorPosition}`;
        }
        document.getElementById('output').innerText = output;
    }
}

document.getElementById('calculateBtn').addEventListener('click', calculate);
