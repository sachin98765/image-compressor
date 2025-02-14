const imageInput = document.getElementById("imageInput");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
const fileSizeInput = document.getElementById("fileSizeInput");
const processButton = document.getElementById("processButton");
const outputCanvas = document.getElementById("outputCanvas");
const downloadLink = document.getElementById("downloadLink");
const ctx = outputCanvas.getContext("2d");

let uploadedImage = null;

// Load the image
imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        uploadedImage = img;
        drawImageToCanvas(img, img.width, img.height); // Display original image
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Process the image
processButton.addEventListener("click", async () => {
  if (!uploadedImage) {
    alert("Please upload an image first.");
    return;
  }

  const width = parseInt(widthInput.value, 10) || uploadedImage.width;
  const height = parseInt(heightInput.value, 10) || uploadedImage.height;
  const targetSizeKB = parseInt(fileSizeInput.value, 10);

  if (!targetSizeKB) {
    alert("Please specify a target size in KB.");
    return;
  }

  // Resize the image
  drawImageToCanvas(uploadedImage, width, height);

  // Compress the image to meet the target size
  const compressedUrl = await compressToTargetSize(targetSizeKB);

  // Update download link
  updateDownloadLink(compressedUrl);
});

// Draw the image to the canvas with specified dimensions
function drawImageToCanvas(img, width, height) {
  outputCanvas.width = width;
  outputCanvas.height = height;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
}

// Compress the image to meet the target file size
async function compressToTargetSize(targetSizeKB) {
  let quality = 1.0;
  let dataUrl = outputCanvas.toDataURL("image/jpeg", quality);

  while (dataUrl.length / 1024 > targetSizeKB && quality > 0.1) {
    quality -= 0.05; // Gradually reduce quality
    dataUrl = outputCanvas.toDataURL("image/jpeg", quality);
  }

  if (dataUrl.length / 1024 > targetSizeKB) {
    alert("Cannot compress further while maintaining reasonable quality.");
  }

  return dataUrl;
}

// Update the download link with the processed image
function updateDownloadLink(dataUrl) {
  downloadLink.href = dataUrl;
  downloadLink.style.display = "inline-block";
}
