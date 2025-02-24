let barcodeValue = "";
let selectedSuffix = "";
let qrCodeValue = "";

// Function to handle barcode scanning
function scanBarcode() {
    const barcodeScanner = new Html5QrcodeScanner(
        "barcodeScanner",
        { fps: 10, qrbox: 250 }
    );
    
    barcodeScanner.render(result => {
        barcodeValue = result;
        document.getElementById("barcodeValue").innerText = `Barcode: ${barcodeValue}`;
        barcodeScanner.clear();
    });
}

// Function to update selected suffix
function updateSuffix() {
    selectedSuffix = document.getElementById("suffixSelect").value;
}

// Function to handle QR code scanning
function scanQRCode() {
    const qrScanner = new Html5QrcodeScanner(
        "qrScanner",
        { fps: 10, qrbox: 250 }
    );
    
    qrScanner.render(result => {
        qrCodeValue = result;
        document.getElementById("qrCodeValue").innerText = `QR Code: ${qrCodeValue}`;
        qrScanner.clear();
    });
}

// Function to validate match
function validateMatch() {
    const modifiedBarcode = barcodeValue + selectedSuffix;
    const resultElement = document.getElementById("validationResult");

    if (modifiedBarcode === qrCodeValue) {
        resultElement.innerText = "Match ✅";
        resultElement.style.color = "green";
    } else {
        resultElement.innerText = "No Match ❌";
        resultElement.style.color = "red";
    }
}

// Initialize scanners
window.onload = function() {
    scanBarcode();
    scanQRCode();
};
