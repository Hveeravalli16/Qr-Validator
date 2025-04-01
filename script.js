let barcodeValue = "";
let qrCodeValue = "";
let selectedProvince = "";
let scanner = null;
let activeScanner = null;

// Function to start barcode scanner
function startBarcodeScanner() {
    stopScanning(); // Stop any active scanner first

    scanner = new ZXing.BrowserBarcodeReader();
    activeScanner = "barcode";

    scanner.decodeFromVideoDevice(undefined, "scannerVideo", result => {
        barcodeValue = result.text;
        document.getElementById("barcodeInput").value = barcodeValue;
        stopScanning();
    }).catch(err => console.error(err));

    showScanner();
}

// Function to start QR code scanner
function startQrScanner() {
    stopScanning(); // Stop any active scanner first

    scanner = new ZXing.BrowserQRCodeReader();
    activeScanner = "qr";

    scanner.decodeFromVideoDevice(undefined, "scannerVideo", result => {
        qrCodeValue = result.text;
        document.getElementById("qrCodeInput").value = qrCodeValue;
        stopScanning();
    }).catch(err => console.error(err));

    showScanner();
}

// Function to update province selection
function updateProvince() {
    selectedProvince = document.getElementById("ProvinceSelect").value;
}

// Function to validate match
function validateMatch() {
    const modifiedBarcode = document.getElementById("barcodeInput").value + selectedProvince;
    const qrCode = document.getElementById("qrCodeInput").value;
    const resultElement = document.getElementById("validationResult");

    if (modifiedBarcode === qrCode) {
        resultElement.innerText = "Match ✅";
        resultElement.style.color = "green";
    } else {
        resultElement.innerText = "No Match ❌";
        resultElement.style.color = "red";
    }
}

// Function to stop scanning
function stopScanning() {
    if (scanner) {
        scanner.reset();
    }
    activeScanner = null;
    hideScanner();
}

// Show scanner UI
function showScanner() {
    const scannerBox = document.getElementById("scannerBox");
    scannerBox.style.display = "block";
    setTimeout(() => {
        scannerBox.classList.add("active");
    }, 10);
}

// Hide scanner UI
function hideScanner() {
    const scannerBox = document.getElementById("scannerBox");
    scannerBox.classList.remove("active");
    setTimeout(() => {
        scannerBox.style.display = "none";
    }, 300);
}

// Refresh button
document.getElementById("refreshButton").addEventListener("click", function () {
    stopScanning();
    location.reload();
});
