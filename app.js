// Hamming kodunu hesaplayan fonksiyon
function calculateHammingCode(data) {
    let r = 0;
    while (Math.pow(2, r) < data.length + r + 1) {
        r++;
    }
    let hammingCode = [];
    let j = 0;
    for (let i = 0; i < data.length + r; i++) {
        if (i === Math.pow(2, j) - 1) {
            hammingCode.push(0);
            j++;
        } else {
            hammingCode.push(parseInt(data.charAt(i - j)));
        }
    }
    for (let i = 0; i < r; i++) {
        let parity = 0;
        let parityPosition = Math.pow(2, i);
        for (let k = parityPosition - 1; k < data.length + r; k += 2 * parityPosition) {
            for (let m = 0; m < parityPosition && k + m < data.length + r; m++) {
                parity ^= hammingCode[k + m];
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
        for (let k = parityPosition - 1; k < hammingCode.length; k += 2 * parityPosition) {
            for (let m = 0; m < parityPosition && k + m < hammingCode.length; m++) {
                parity ^= parseInt(hammingCode.charAt(k + m));
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
            decodedData.push(parseInt(hammingCode.charAt(i)));
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
        document.getElementById('output').innerText = "Geçersiz veri girdiniz!";
    } else {
        let hammingCode = calculateHammingCode(data);
        let output = "Hamming Kodu: " + hammingCode + "\n";

        if (isNaN(errorPosition) || errorPosition < 1 || errorPosition > hammingCode.length) {
            output += "Geçersiz pozisyon!";
        } else {
            let corruptedCode = introduceError(hammingCode, errorPosition);
            output += "Hata Simüle Edilmiş Kod: " + corruptedCode + "\n";

            let syndrome = calculateSyndrome(corruptedCode);
            if (syndrome === 0) {
                output += "Sendrom: " + syndrome + " (Hata bulunamadı)";
            } else {
                output += "Sendrom: " + syndrome + " (Hata pozisyonu: " + syndrome + ")";
            }
        }

        document.getElementById('output').innerText = output;
    }
}
