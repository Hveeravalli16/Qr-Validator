let barcodeValue = "";
let selectedProvince = "";
let qrCodeValue = "";
let barcodeReader = new ZXing.BrowserMultiFormatReader();
let qrReader = new ZXing.BrowserMultiFormatReader();
let barcodeStream = null;
let qrStream = null;

// Function to request camera access
async function requestCameraAccess() {
    try {
        console.log("Requesting camera access...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Stop it immediately
        console.log("Camera access granted!");
    } catch (error) {
        console.error("Camera permission denied:", error);
        document.getElementById("errorMessage").innerText = "Camera permission is required!";
    }
}

// Function to start barcode scanner
async function startBarcodeScanner() {
    console.log("Starting barcode scanner...");
    try {
        barcodeStream = await barcodeReader.decodeFromVideoDevice(null, "barcodeScanner", (result, err) => {
            if (result) {
                console.log("Barcode scanned:", result.text);
                barcodeValue = result.text;
                document.getElementById("barcodeValue").innerText = `Barcode: ${barcodeValue}`;
                barcodeReader.reset();
            }
        });
    } catch (error) {
        console.error("Barcode Scanner Error:", error);
        document.getElementById("errorMessage").innerText = "Error starting barcode scanner!";
    }
}

// Function to start QR scanner
async function startQRScanner() {
    console.log("Starting QR scanner...");
    try {
        qrStream = await qrReader.decodeFromVideoDevice(null, "qrScanner", (result, err) => {
            if (result) {
                console.log("QR Code scanned:", result.text);
                qrCodeValue = result.text;
                document.getElementById("qrCodeValue").innerText = `QR Code: ${qrCodeValue}`;
                qrReader.reset();
            }
        });
    } catch (error) {
        console.error("QR Scanner Error:", error);
        document.getElementById("errorMessage").innerText = "Error starting QR scanner!";
    }
}

// Function to update selected Province
function updateProvince() {
    selectedProvince = document.getElementById("ProvinceSelect").value;
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

// Refresh Button: Stops scanner & reloads page
document.getElementById("refreshButton").addEventListener("click", function () {
    console.log("Stopping scanners and refreshing page...");
    if (barcodeReader) barcodeReader.reset();
    if (qrReader) qrReader.reset();
    location.reload();
});

// Attach event listeners for buttons
document.getElementById("startBarcodeScan").addEventListener("click", async () => {
    await requestCameraAccess();
    startBarcodeScanner();
});

document.getElementById("startQRScan").addEventListener("click", async () => {
    await requestCameraAccess();
    startQRScanner();
});
