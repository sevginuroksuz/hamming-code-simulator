// Hamming kodunu hesaplayan fonksiyon
function calculateHammingCode(data) {
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
            hammingCode[i - 1] = parseInt(data.charAt(k));
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
        hammingCode[parityPosition - 1] = parity;
    }
    return {
        hammingCode: hammingCode.join(''),
        parityBitsPositions: parityBitsPositions
    };
}

// Hata simülasyonu
function introduceError(hammingCode, position) {
    let bit = parseInt(hammingCode.charAt(position - 1));
    bit = bit === 0 ? 1 : 0; // Bir hata oluştur
    let modifiedCode = hammingCode.substr(0, position - 1) + bit + hammingCode.substr(position);
    return modifiedCode;
}

// Sendromu hesaplayan fonksiyon
function calculateSyndrome(hammingCode) {
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
                parity ^= parseInt(hammingCode.charAt(j + k));
            }
        }
        syndrome += parity * parityPosition;
    }
    return syndrome;
}

// Birinci sayfadan ikinci sayfaya yönlendirme ve veri aktarma
function goToStep2() {
    const data = document.getElementById('bitData').value;
    if (data === null || data === "") {
        alert("Invalid data input!");
    } else {
        const { hammingCode, parityBitsPositions } = calculateHammingCode(data);
        localStorage.setItem('hammingCode', hammingCode);
        localStorage.setItem('parityBitsPositions', JSON.stringify(parityBitsPositions));
        localStorage.setItem('data', data);
        window.location.href = 'step2.html';
    }
}

// İkinci sayfada Hamming kodunu ve parite bitlerini gösterme
window.onload = function() {
    if (window.location.pathname.includes('step2.html')) {
        const hammingCode = localStorage.getItem('hammingCode');
        const parityBitsPositions = JSON.parse(localStorage.getItem('parityBitsPositions'));
        const data = localStorage.getItem('data');
        document.getElementById('hammingInfo').innerText = 
            `Data transferred is ${hammingCode}\nParity bits positions: ${parityBitsPositions.join(', ')}\nOriginal data: ${data}`;
    }
}

// Hata kontrolü ve sendrom hesaplama
function checkError() {
    const receivedData = document.getElementById('receivedData').value;
    const syndrome = calculateSyndrome(receivedData);
    let output = `Received Data: ${receivedData}\nSyndrome: ${syndrome}\n`;
    if (syndrome === 0) {
        output += "The position of error is not found (no error detected)";
    } else {
        output += `The position of error is ${syndrome}`;
    }
    document.getElementById('output').innerText = output;
}
