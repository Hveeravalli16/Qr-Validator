let barcodeValue = "";
let selectedProvince = "";
let qrCodeValue = "";
let barcodeReader = new ZXing.BrowserMultiFormatReader();
let qrReader = new ZXing.BrowserMultiFormatReader();
let barcodeStream = null;
let qrStream = null;

// Function to get the default rear camera
async function getRearCamera() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')) || videoDevices[0];

    if (!rearCamera) {
        document.getElementById("errorMessage").innerText = "No camera found!";
        return null;
    }

    return rearCamera.deviceId;
}

// Function to start barcode scanner
async function startBarcodeScanner() {
    const deviceId = await getRearCamera();
    if (!deviceId) return;

    barcodeReader.decodeFromVideoDevice(deviceId, "barcodeScanner", (result, err) => {
        if (result) {
            barcodeValue = result.text;
            document.getElementById("barcodeValue").innerText = `Barcode: ${barcodeValue}`;
            barcodeReader.reset();
        }
    }).catch(error => {
        document.getElementById("errorMessage").innerText = "Error starting barcode scanner!";
        console.error("Barcode Scanner Error:", error);
    });
}

// Function to start QR scanner
async function startQRScanner() {
    const deviceId = await getRearCamera();
    if (!deviceId) return;

    qrReader.decodeFromVideoDevice(deviceId, "qrScanner", (result, err) => {
        if (result) {
            qrCodeValue = result.text;
            document.getElementById("qrCodeValue").innerText = `QR Code: ${qrCodeValue}`;
            qrReader.reset();
        }
    }).catch(error => {
        document.getElementById("errorMessage").innerText = "Error starting QR scanner!";
        console.error("QR Scanner Error:", error);
    });
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
    if (barcodeStream) barcodeReader.reset();
    if (qrStream) qrReader.reset();
    location.reload();
});