let originalData = ''; // Kullanıcı tarafından girilen orijinal veri
let hammingCode = ''; // Oluşturulan Hamming kodu

// Kullanıcının girdiği veriyi alır ve Hamming kodunu oluşturur
function generateHammingCode() {
    const data = document.getElementById('dataInput').value;
    // Geçersiz girişi kontrol eder (4, 8 veya 16 bitlik ikili sayı)
    if (!/^[01]+$/.test(data) || (data.length !== 4 && data.length !== 8 && data.length !== 16)) {
        document.getElementById('hammingCodeOutput').innerText = 'Invalid input. Please enter a 4, 8, or 16 bit binary number.';
        return;
    }
    originalData = data;
    hammingCode = calculateHammingCode(data);
    document.getElementById('hammingCodeOutput').innerText = `Hamming Code: ${hammingCode}`;
}

// Hamming kodunu hesaplar
function calculateHammingCode(data) {
    const dataBits = data.split('').map(Number);
    const m = dataBits.length;
    const r = Math.ceil(Math.log2(m + Math.ceil(Math.log2(m)) + 1)); // Parite bitlerinin sayısını hesaplar
    const totalBits = m + r;

    let hamming = Array(totalBits).fill(0);
    let j = 0;

    // Veri bitlerini uygun yerlere yerleştirir (parite bitlerinin konumlarını atlar)
    for (let i = 1; i <= totalBits; i++) {
        if (Math.log2(i) % 1 !== 0) {
            hamming[i - 1] = dataBits[j];
            j++;
        }
    }

    // Parite bitlerini hesaplar ve yerleştirir
    for (let i = 0; i < r; i++) {
        let parityBitPosition = Math.pow(2, i);
        let parity = 0;

        for (let j = parityBitPosition - 1; j < totalBits; j += 2 * parityBitPosition) {
            for (let k = j; k < j + parityBitPosition && k < totalBits; k++) {
                parity ^= hamming[k];
            }
        }

        hamming[parityBitPosition - 1] = parity;
    }

    return hamming.join('');
}

// Kullanıcı tarafından belirtilen konumdaki biti ters çevirir (hata oluşturur)
function introduceError() {
    const errorBit = parseInt(document.getElementById('errorBit').value);
    if (errorBit <= 0 || errorBit > hammingCode.length) {
        document.getElementById('errorOutput').innerText = 'Invalid bit position';
        return;
    }

    hammingCode = flipBit(hammingCode, errorBit - 1);
    document.getElementById('errorOutput').innerText = `Hamming Code with Error: ${hammingCode}`;
}

// Verilen konumdaki biti ters çevirir
function flipBit(code, position) {
    let codeArray = code.split('');
    codeArray[position] = codeArray[position] === '0' ? '1' : '0';
    return codeArray.join('');
}

// Hamming kodunda hatayı tespit eder ve düzeltir
function detectAndCorrectError() {
    let syndrome = 0;
    for (let i = 0; i < Math.ceil(Math.log2(hammingCode.length)); i++) {
        let parityBitPosition = Math.pow(2, i);
        let parity = 0;

        // Parite bitlerini kontrol eder
        for (let j = parityBitPosition - 1; j < hammingCode.length; j += 2 * parityBitPosition) {
            for (let k = j; k < j + parityBitPosition && k < hammingCode.length; k++) {
                parity ^= parseInt(hammingCode[k]);
            }
        }

        // Eğer parite bitinde hata varsa sendromu günceller
        if (parity !== 0) {
            syndrome += parityBitPosition;
        }
    }

    // Eğer sendrom 0'dan büyükse hata tespit edilmiştir ve düzeltilir
    if (syndrome > 0) {
        hammingCode = flipBit(hammingCode, syndrome - 1);
        document.getElementById('correctionOutput').innerText = `Error detected and corrected at bit position ${syndrome}. Corrected Hamming Code: ${hammingCode}`;
    } else {
        document.getElementById('correctionOutput').innerText = 'No error detected.';
    }
}
