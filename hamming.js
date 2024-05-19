// Hamming kodunu hesaplayan fonksiyon
function calculateHammingCode(data) {
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
    return hammingCode.join('');
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

// Hamming kodunu çözen fonksiyon
function decodeHammingCode(hammingCode) {
    let r = 0;
    while (Math.pow(2, r) < hammingCode.length + 1) {
        r++;
    }
    let decodedData = [];
    let j = 0;
    for (let i = 0; i < hammingCode.length; i++) {
        if (i !== Math.pow(2, j) - 1) {
            decodedData.push(hammingCode.charAt(i));
        } else {
            j++;
        }
    }
    return decodedData.join('');
}

// Kullanıcı etkileşimi fonksiyonu
function simulateError() {
    let data = document.getElementById('bitData').value;
    let errorPosition = parseInt(document.getElementById('errorPosition').value);

    if (data === null || data === "") {
        document.getElementById('output').innerText = "Invalid data input!";
    } else {
        let hammingCode = calculateHammingCode(data);
        let output = "Data transferred is " + hammingCode + "\n";

        if (isNaN(errorPosition) || errorPosition < 1 || errorPosition > hammingCode.length) {
            output += "Invalid position!";
        } else {
            let corruptedCode = introduceError(hammingCode, errorPosition);
            output += "Error Data is " + corruptedCode + "\n";

            let syndrome = calculateSyndrome(corruptedCode);
            if (syndrome === 0) {
                output += "The position of error is not found (no error detected)";
            } else {
                output += "The position of error is " + syndrome;
            }
        }

        document.getElementById('output').innerText = output;
    }
}
