let scannedValue = "";
let selectedProvince = "";

// Request camera permission
async function requestCameraAccess() {
    try {
        console.log("Requesting camera access...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Stop immediately
        console.log("Camera access granted!");
    } catch (error) {
        console.error("Camera permission denied:", error);
        document.getElementById("errorMessage").innerText = "Camera permission is required!";
    }
}

// Start QuaggaJS scanner
function startScanner() {
    console.log("Starting scanner...");
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#scanner"),
            constraints: {
                facingMode: "environment", // Use rear camera
            },
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "qr_reader"], // Supports barcodes & QR codes
        },
    }, function(err) {
        if (err) {
            console.error("QuaggaJS Error:", err);
            document.getElementById("errorMessage").innerText = "Error starting scanner!";
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function(data) {
        scannedValue = data.codeResult.code;
        document.getElementById("scannedValue").innerText = `Scanned Code: ${scannedValue}`;
        Quagga.stop();
    });
}

// Function to update selected Province
function updateProvince() {
    selectedProvince = document.getElementById("ProvinceSelect").value;
}

// Function to validate match
function validateMatch() {
    const modifiedCode = scannedValue + selectedProvince;
    const resultElement = document.getElementById("validationResult");

    if (modifiedCode === scannedValue) {
        resultElement.innerText = "Match ✅";
        resultElement.style.color = "green";
    } else {
        resultElement.innerText = "No Match ❌";
        resultElement.style.color = "red";
    }
}

// Refresh Button: Stops scanner & reloads page
document.getElementById("refreshButton").addEventListener("click", function () {
    console.log("Stopping scanner and refreshing page...");
    Quagga.stop();
    location.reload();
});

// Start scan on button click
document.getElementById("startScan").addEventListener("click", async () => {
    await requestCameraAccess();
    startScanner();
});
