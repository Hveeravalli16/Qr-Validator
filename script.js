let barcodeValue = "";
let selectedProvince = "";
let qrCodeValue = "";

// Request camera permission
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

// Start barcode scanner using QuaggaJS
function startBarcodeScanner() {
    console.log("Starting barcode scanner...");
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#barcodeScanner"),
            constraints: {
                facingMode: "environment", // Use rear camera
            },
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader"],
        },
    }, function(err) {
        if (err) {
            console.error("QuaggaJS Error:", err);
            document.getElementById("errorMessage").innerText = "Error starting barcode scanner!";
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function(data) {
        barcodeValue = data.codeResult.code;
        document.getElementById("barcodeValue").innerText = `Barcode: ${barcodeValue}`;
        Quagga.stop();
    });
}

// Start QR scanner using ZXing
function startQRScanner() {
    console.log("Starting QR scanner...");
    const qrReader = new ZXing.BrowserQRCodeReader();
    qrReader.decodeFromVideoDevice(null, "qrScanner", (result, err) => {
        if (result) {
            console.log("QR Code scanned:", result.text);
            qrCodeValue = result.text;
            document.getElementById("qrCodeValue").innerText = `QR Code: ${qrCodeValue}`;
            qrReader.reset();
        }
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
    console.log("Stopping scanners and refreshing page...");
    Quagga.stop();
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
