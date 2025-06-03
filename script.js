let barcodeValue = "";
let selectedProvince = "";
let qrCodeValue = "";
let barcodeScanner = null;
let qrScanner = null;

// Function to start barcode scanning
function startBarcodeScanner() {
    stopScanning(); // Stops any active scanner before starting a new one

    barcodeScanner = new Html5Qrcode(
        "barcodeScanner",
        { fps: 10, qrbox: 250 },
        false
    );

    barcodeScanner.render(result => {
        barcodeValue = result;
        document.getElementById("barcodeInput").value = barcodeValue;
        stopScanning(); // Stops scanner after successful scan
    }, errorMessage => {
        console.log("Barcode scanning error: ", errorMessage);
    });

    document.getElementById("barcodeScanner").focus();
}

// Function to start QR code scanning
function startQrScanner() {
    stopScanning(); // Stops any active scanner before starting a new one

    qrScanner = new Html5Qrcode(
        "qrScanner",
        { fps: 10, qrbox: 250, inversionAttempts: "both" },
        false
    );

    qrScanner.render(result => {
        qrCodeValue = result;
        document.getElementById("qrCodeInput").value = qrCodeValue;
        stopScanning(); // Stops scanner after successful scan
    }, errorMessage => {
        console.log("QR scanning error: ", errorMessage);
    });

    document.getElementById("qrScanner").focus();
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
    const modifiedBarcode = document.getElementById("barcodeInput").value + selectedProvince;
    const enteredQrCode = document.getElementById("qrCodeInput").value;
    const resultElement = document.getElementById("validationResult");

    if (modifiedBarcode === enteredQrCode) {
        resultElement.innerText = "Match ✅";
        resultElement.style.color = "green";
    } else {
        resultElement.innerText = "No Match ❌";
        resultElement.style.color = "red";
    }
}

// Function to update selected Province
function updateProvince() {
    selectedProvince = document.getElementById("ProvinceSelect").value;
    document.getElementById("ProvinceSelect").focus();
}

// Refresh button stops scanning and reloads the page
document.getElementById("refreshButton").addEventListener("click", function() {
    stopScanning();
    location.reload();
});

// Start barcode scanning
document.getElementById("startBarcodeScanning").addEventListener("click", function() {
    startBarcodeScanner();
});

// Start QR code scanning
document.getElementById("startQrScanning").addEventListener("click", function() {
    startQrScanner();
});