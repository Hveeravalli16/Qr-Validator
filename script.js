let barcodeValue = "";
let selectedProvince = "";
let qrCodeValue = "";
let barcodeReader = new ZXing.BrowserMultiFormatReader();
let qrReader = new ZXing.BrowserMultiFormatReader();
let barcodeStream = null;
let qrStream = null;

// Function to get the default rear camera
async function getRearCamera() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
            document.getElementById("errorMessage").innerText = "No camera found!";
            return null;
        }

        // Prefer rear camera if available
        const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')) || videoDevices[0];

        return rearCamera.deviceId;
    } catch (error) {
        console.error("Error getting rear camera:", error);
        document.getElementById("errorMessage").innerText = "Camera access denied!";
        return null;
    }
}

// Function to start barcode scanner
async function startBarcodeScanner() {
    try {
        if (barcodeStream) {
            barcodeReader.reset();
        }

        const deviceId = await getRearCamera();
        if (!deviceId) return;

        barcodeReader.decodeFromVideoDevice(deviceId, "barcodeScanner", (result, err) => {
            if (result) {
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
    try {
        if (qrStream) {
            qrReader.reset();
        }

        const deviceId = await getRearCamera();
        if (!deviceId) return;

        qrReader.decodeFromVideoDevice(deviceId, "qrScanner", (result, err) => {
            if (result) {
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
    if (barcodeReader) barcodeReader.reset();
    if (qrReader) qrReader.reset();
    location.reload();
});

// Attach event listeners for buttons
document.getElementById("startBarcodeScan").addEventListener("click", startBarcodeScanner);
document.getElementById("startQRScan").addEventListener("click", startQRScanner);
