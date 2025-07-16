let barcodeValue = "";
let selectedProvince = "";
let qrCodeValue = "";
let barcodeScanner = null;
let qrScanner = null;

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzTXWBFtoDpa1mfzHn3h7urB1yCxcEi7tecktHxY3CHN_9-WNPlxQRvPs_YIHR7LHde/exec"; // REPLACE THIS

function updateProvince() {
  selectedProvince = document.getElementById("ProvinceSelect").value;
}

function startBarcodeScanner() {
  stopScanning();

  barcodeScanner = new Html5QrcodeScanner(
    "barcodeScanner",
    { fps: 10, qrbox: 250 },
    false
  );

  barcodeScanner.render(result => {
    barcodeValue = result;
    document.getElementById("barcodeInput").value = barcodeValue;
    stopScanning();
  }, error => {
    console.warn("Barcode scan error: ", error);
  });
}

function startQrScanner() {
  stopScanning();

  qrScanner = new Html5QrcodeScanner(
    "qrScanner",
    { fps: 10, qrbox: 250, inversionAttempts: "both" },
    false
  );

  qrScanner.render(result => {
    qrCodeValue = result;
    document.getElementById("qrCodeInput").value = qrCodeValue;
    stopScanning();
  }, error => {
    console.warn("QR scan error: ", error);
  });
}

function stopScanning() {
  if (barcodeScanner) {
    try { barcodeScanner.clear(); } catch (e) {}
    barcodeScanner = null;
  }

  if (qrScanner) {
    try { qrScanner.clear(); } catch (e) {}
    qrScanner = null;
  }
}

function validateMatch() {
  const barcodeInput = document.getElementById("barcodeInput").value.trim();
  const qrInput = document.getElementById("qrCodeInput").value.trim();
  const modifiedBarcode = barcodeInput + selectedProvince;

  if (modifiedBarcode === qrInput) {
    fetchProductDetails(barcodeInput, selectedProvince);
  } else {
    const result = document.getElementById("validationResult");
    result.innerText = "No Match ❌";
    result.style.color = "red";
  }
}

function fetchProductDetails(barcode, province) {
  const resultDiv = document.getElementById("validationResult");
  const url = `${SCRIPT_URL}?barcode=${barcode}&province=${province}`;

  resultDiv.innerHTML = "🔍 Looking up product...";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        resultDiv.innerText = "❌ " + data.error;
        resultDiv.style.color = "red";
      } else {
        const brandLine = `${data.brand} – ${data.description}`;
        const provinceLine = `${data.brand} – ${data.description} – ${data.provinceCode}`;
        resultDiv.innerHTML = `
          ✅ Match<br>
          <strong>Base SKU:</strong> ${data.baseSku}<br>
          <strong>${brandLine}</strong><br><br>
          <strong>Provincial SKU:</strong> ${data.provincialSku}<br>
          <strong>${provinceLine}</strong>
        `;
        resultDiv.style.color = "green";
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      resultDiv.innerText = "❌ Error fetching data.";
    });
}

document.getElementById("startBarcodeScanning").addEventListener("click", startBarcodeScanner);
document.getElementById("startQrScanning").addEventListener("click", startQrScanner);
document.getElementById("validateButton").addEventListener("click", validateMatch);
document.getElementById("refreshButton").addEventListener("click", () => {
  stopScanning();
  location.reload();
});
