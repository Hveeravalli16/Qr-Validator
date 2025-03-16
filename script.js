let barcodeValue = "";
let selectedProvince = "";
let qrCodeValue = "";
let barcodeScanner = null;
let qrScanner = null;

// Function to start barcode scanning
function startBarcodeScanner() {
    stopScanning(); // Stop any active scanner before starting a new one

    barcodeScanner = new Html5QrcodeScanner(
        "barcodeScanner",
        { fps: 10, qrbox: 250 },
        false
    );

    barcodeScanner.render(result => {
        barcodeValue = result;
        document.getElementById("barcodeValue").innerText = `Barcode: ${barcodeValue}`;
        stopScanning(); // Stops scanner after successful scan
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
    stopScanning(); // Stop any active scanner before starting a new one

    qrScanner = new Html5QrcodeScanner(
        "qrScanner",
        { fps: 10, qrbox: 250 },
        false
    );

    qrScanner.render(result => {
        qrCodeValue = result;
        document.getElementById("qrCodeValue").innerText = `${qrCodeValue}`;
        stopScanning(); // Stops scanner after successful scan
    }, errorMessage => {
        console.log("QR scanning error: ", errorMessage);
    });
}

// Function to stop all scanners safely
function stopScanning() {
    if (barcodeScanner) {
        try {
            barcodeScanner.clear();
        } catch (error) {
            console.warn("Barcode scanner already cleared or not present.");
        }
        barcodeScanner = null;
    }

    if (qrScanner) {
        try {
            qrScanner.clear();
        } catch (error) {
            console.warn("QR scanner already cleared or not present.");
        }
        qrScanner = null;
    }
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

// Refresh button stops scanning and reloads the page
document.getElementById("refreshButton").addEventListener("click", function() {
    stopScanning();
    location.reload();
});

// Start scanning when button is pressed
document.getElementById("startScanning").addEventListener("click", function() {
    startBarcodeScanner();
    //startQrScanner();
});