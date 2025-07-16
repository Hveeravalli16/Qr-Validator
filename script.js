let barcodeData = "";
let provinceCode = "";
let html5QrcodeScanner;
const sheetAPI = "https://script.google.com/macros/s/AKfycbzTXWBFtoDpa1mfzHn3h7urB1yCxcEi7tecktHxY3CHN_9-WNPlxQRvPs_YIHR7LHde/exec";

// DOM elements
const scannerDiv = document.getElementById("scanner");
const barcodeDisplay = document.getElementById("barcode-display");
const qrDisplay = document.getElementById("qr-display");
const productInfo = document.getElementById("product-info");
const validationResult = document.getElementById("validation-result");

function startScanner(onScanSuccess) {
  scannerDiv.style.display = "block";

  html5QrcodeScanner = new Html5Qrcode("scanner");
  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      const cameraId = devices[0].id;
      html5QrcodeScanner.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        onScanSuccess
      );
    }
  }).catch(err => {
    alert("Camera access error: " + err);
  });
}

function stopScanner() {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.stop().then(() => {
      html5QrcodeScanner.clear();
      scannerDiv.style.display = "none";
    }).catch(console.error);
  }
}

document.getElementById("scan-barcode-btn").addEventListener("click", () => {
  stopScanner();
  startScanner((decodedText) => {
    stopScanner();
    barcodeData = decodedText.trim();
    barcodeDisplay.textContent = barcodeData;

    // Extract province suffix (last 2 characters)
    provinceCode = barcodeData.slice(-2);

    fetch(`${sheetAPI}?barcode=${barcodeData}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          productInfo.textContent = "Product not found.";
        } else {
          productInfo.textContent = `${data.baseSku} - ${data.brand} - ${data.product}`;
        }
      });
  });
});

document.getElementById("scan-qr-btn").addEventListener("click", () => {
  stopScanner();
  startScanner((qrText) => {
    stopScanner();
    qrDisplay.textContent = qrText;

    if (qrText.trim() === barcodeData) {
      validationResult.innerHTML = `✅ Match<br>Provincial SKU: ${provinceCode}<br>${productInfo.textContent} - ${provinceCode}`;
    } else {
      validationResult.innerHTML = `❌ No Match`;
    }
  });
});
