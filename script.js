let barcodeValue = "";
let selectedProvince = "";
let qrCodeValue = "";
let barcodeScanner = null;
let qrScanner = null;

// Function to start barcode scanning
function startBarcodeScanner() {
    if (barcodeScanner) {
        barcodeScanner.clear();
    }

    barcodeScanner = new Html5QrcodeScanner(
        "barcodeScanner",
        { fps: 10, qrbox: 250 },
        false
    );

    barcodeScanner.render(result => {
        barcodeValue = result;
        document.getElementById("barcodeValue").innerText = `Barcode: ${barcodeValue}`;
        barcodeScanner.clear();
    }, errorMessage => {
        console.log("Barcode scanning error: ", errorMessage);
    });
}

// Function to update selected Province
function updateProvince() {
    selectedProvince = document.getElementById("ProvinceSelect").value;
}

// Function to start QR code scanning
function startQrScanner() {
    if (qrScanner) {
        qrScanner.clear();
    }

    qrScanner = new Html5QrcodeScanner(
        "qrScanner",
        { fps: 10, qrbox: 250 },
        false
    );

    qrScanner.render(result => {
        qrCodeValue = result;
        document.getElementById("qrCodeValue").innerText = `${qrCodeValue}`;
        qrScanner.clear();
    }, errorMessage => {
        console.log("QR scanning error: ", errorMessage);
    });
}

// Function to validate match
function validateMatch() {
    const modifiedBarcode = barcodeValue + selectedProvince;
    const resultElement = document.getElementById("validationResult");

    if (modifiedBarcode === qrCodeValue) {
        resultElement.innerText = "Match ✅";
        resultElement.style.color = "green";
    } else {
        resultElement.innerText = "No Match ❌";
        resultElement.style.color = "red";
    }
}

// Function to stop all scanning
function stopScanning() {
    if (barcodeScanner) {
        barcodeScanner.clear();
    }
    if (qrScanner) {
        qrScanner.clear();
    }
}

// Refresh button stops scanning and reloads the page
document.getElementById("refreshButton").addEventListener("click", function() {
    stopScanning();
    location.reload();
});

// Start scanning when button is pressed
document.getElementById("startScanning").addEventListener("click", function() {
    startBarcodeScanner();
    startQrScanner();
});