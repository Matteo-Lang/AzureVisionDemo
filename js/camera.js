// camera.js:
import { API_URL, API_KEY } from './config.js';

// This is the rate of how frequent your camera image is sent to the Computer Vision API
var CAPTURE_RATE = 3000;  // milliseconds

// Camera settings
var CONSTRAINTS = {
  audio: false,
  video: { facingMode: 'environment' },  // using the rear camera
  video: { exact: {
    height: 500,  // change this to your desired image height
    width: 800    // change this to your desired image width
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

    setInterval(function () {
      context.drawImage(video, 0, 0, 680, 480);
      sendImageToAPI();  // invoke the call to Computer Vision API
    }, CAPTURE_RATE);

  } catch (err) {
    console.error('Error starting camera: ', err);
  }
}

// Send your camera image to Computer Vision API
function sendImageToAPI() {
  var payload = dataURItoBlob();
  console.log(payload);

  $.ajax({
    type: 'POST',
    url: `${API_URL}/vision/v3.2/analyze?visualFeatures=Tags`, // Endpoint for analyzing tags
    headers: {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': API_KEY
    },
    data: payload,
    processData: false,
    success: function (data) {
      console.log(data);
      detectHeadset(data);
    },
    error: function (xhr, status) {
      alert('API POST Error.');
    }
  });
}

// Detect headset in the response data
function detectHeadset(data) {
  var tags = data.tags;
  var headsetDetected = tags.some(tag => tag.name === 'headset' || tag.name === 'headphones');

  if (headsetDetected) {
    changeInnerHtml('.status', 'Headset detected');
  } else {
    changeInnerHtml('.status', 'No headset detected');
  }
}

// Helper functions - DO NOT CHANGE IF YOU DON'T UNDERSTAND THE CODE BELOW
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
