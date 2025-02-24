let barcodeValue = "";
let selectedProvince = "";
let qrCodeValue = "";

// Function to handle barcode scanning
function scanBarcode() {
    const barcodeScanner = new Html5QrcodeScanner(
        "barcodeScanner",
        { fps: 10, qrbox: 250 },
        false // Disable verbose logging
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

// Function to handle QR code scanning
function scanQRCode() {
    const qrScanner = new Html5QrcodeScanner(
        "qrScanner",
        { fps: 10, qrbox: 250 },
        false // Disable verbose logging
    );

    qrScanner.render(result => {
        qrCodeValue = result;
        document.getElementById("qrCodeValue").innerText = `QR Code: ${qrCodeValue}`;
        qrScanner.clear();
    }, errorMessage => {
        console.log("QR code scanning error: ", errorMessage);
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

// Force Rear Camera for Mobile
/*function requestRearCameraAccess() {
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
    })
    .then(stream => {
        console.log("Rear camera access granted.");
    })
    .catch(error => {
        console.error("Camera access error:", error);
    });
}*/

document.getElementById("refreshButton").addEventListener("click", function() {
    location.reload();
});

// Initialize scanners
window.onload = function() {
    //requestRearCameraAccess(); // Ensure rear camera access
    scanBarcode();
    scanQRCode();
};
