let barcodeValue = "";
let selectedProvince = "";
let qrCodeValue = "";
let barcodeReader = new ZXing.BrowserMultiFormatReader();
let qrReader = new ZXing.BrowserMultiFormatReader();
let barcodeStream = null;
let qrStream = null;

// Function to start barcode scanner
async function startBarcodeScanner() {
    try {
        const devices = await barcodeReader.getVideoInputDevices();
        const rearCamera = devices.find(device => device.label.toLowerCase().includes('back')) || devices[0];

        barcodeStream = barcodeReader.decodeFromVideoDevice(rearCamera.deviceId, "barcodeScanner", (result, err) => {
            if (result) {
                barcodeValue = result.text;
                document.getElementById("barcodeValue").innerText = `Barcode: ${barcodeValue}`;
                barcodeReader.reset();
            }
        });
    } catch (error) {
        console.error("Barcode Scanner Error:", error);
    }
}

// Function to start QR scanner
async function startQRScanner() {
    try {
        const devices = await qrReader.getVideoInputDevices();
        const rearCamera = devices.find(device => device.label.toLowerCase().includes('back')) || devices[0];

        qrStream = qrReader.decodeFromVideoDevice(rearCamera.deviceId, "qrScanner", (result, err) => {
            if (result) {
                qrCodeValue = result.text;
                document.getElementById("qrCodeValue").innerText = `QR Code: ${qrCodeValue}`;
                qrReader.reset();
            }
        });
    } catch (error) {
        console.error("QR Scanner Error:", error);
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
    if (barcodeStream) barcodeReader.reset();
    if (qrStream) qrReader.reset();
    location.reload();
});

// Auto-start scanners on page load
window.onload = function () {
    startBarcodeScanner();
    startQRScanner();
};
