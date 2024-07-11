import { API_URL, API_KEY, STORAGE_ACCOUNT_NAME, CONTAINER_NAME, SAS_TOKEN } from './config.js';
import { BlobServiceClient } from '@azure/storage-blob';
import $ from 'jquery';

let CAPTURE_RATE = 3000;  // milliseconds
let isProcessing = false;  // Flag to prevent multiple saves
let captureInterval;  // Variable to store the interval ID

var CONSTRAINTS = {
  audio: false,
  video: { facingMode: 'environment' },
  video: { exact: {
    height: 500,
    width: 800
  }}
};

async function cameraStart() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(CONSTRAINTS);

    var video = document.getElementById('video');
    video.srcObject = stream;
    video.play();

    var canvas = document.getElementById('canvas');
    canvas.style.display = 'none';
    var context = canvas.getContext('2d');

    // Function to capture image and send to API
    function captureImage() {
      context.drawImage(video, 0, 0, 680, 480);
      if (!isProcessing) {
        isProcessing = true;
        sendImageToAPI();
      }
    }

    // Start initial capture interval
    captureInterval = setInterval(captureImage, CAPTURE_RATE);

    // Update CAPTURE_RATE based on slider input
    document.getElementById('captureRateSlider').addEventListener('input', function (event) {
      CAPTURE_RATE = parseInt(event.target.value, 10);
      document.getElementById('captureRateValue').textContent = CAPTURE_RATE;

      // Clear existing interval and set a new one with updated CAPTURE_RATE
      clearInterval(captureInterval);
      captureInterval = setInterval(captureImage, CAPTURE_RATE);
    });

  } catch (err) {
    console.error('Error starting camera: ', err);
  }
}

function sendImageToAPI() {
  var payload = dataURItoBlob();
  console.log(payload);

  $.ajax({
    type: 'POST',
    url: `${API_URL}/vision/v3.2/analyze?visualFeatures=Tags`,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': API_KEY
    },
    data: payload,
    processData: false,
    success: function (data) {
      console.log(data);
      detectHeadset(data, payload);
    },
    error: function (xhr, status) {
      alert('API POST Error.');
      isProcessing = false;  // Reset flag on error
    }
  });
}

function detectHeadset(data, imageData) {
  var tags = data.tags;
  var headsetDetected = tags.some(tag => tag.name === 'headset' || tag.name === 'headphones');

  if (headsetDetected) {
    changeInnerHtml('.status', 'Headset detected');
    isProcessing = false;  // Reset flag when detection is complete
  } else {
    changeInnerHtml('.status', 'No headset detected');
    var uploadCheckbox = document.getElementById('uploadCheckbox');
    if (uploadCheckbox.checked) {
      saveImageToBlobStorage(imageData);
    } else {
      isProcessing = false;  // Reset flag if not uploading
    }
  }
}

async function saveImageToBlobStorage(imageData) {
  const blobServiceClient = new BlobServiceClient(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net${SAS_TOKEN}`);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blobName = `no-headset-${new Date().toISOString()}.jpg`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    await blockBlobClient.uploadData(imageData, {
      blobHTTPHeaders: { blobContentType: "image/jpeg" }
    });
    console.log(`Image uploaded successfully to Blob Storage as ${blobName}`);
  } catch (err) {
    console.error('Error uploading image to Blob Storage: ', err);
  } finally {
    isProcessing = false;  // Ensure flag is reset after upload
  }
}

function dataURItoBlob() {
  var canvas = document.getElementById('canvas');
  var dataUri = canvas.toDataURL('image/jpeg');
  var data = dataUri.split(',')[1];
  var mimeType = dataUri.split('')[0].slice(5);

  var bytes = window.atob(data);
  var buf = new ArrayBuffer(bytes.length);
  var byteArr = new Uint8Array(buf);

  for (var i = 0; i < bytes.length; i++) {
    byteArr[i] = bytes.charCodeAt(i);
  }
  return new Blob([buf], { type: mimeType });
}

function changeInnerHtml(elementPath, newText) {
  $(elementPath).fadeOut(500, function () {
    $(this).html(newText).fadeIn(500);
  });
}

export { cameraStart };
