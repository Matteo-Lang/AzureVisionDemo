# Azure Cognitive Services Demo

## Description
This project implements object recognition using a local webcam and the Computer Vision API from Azure Cognitive Services.

## Running this project
### Run using a webserver
The project won't run properly if you just open the LiveCameraResult.html in your browser. Instead, please use a proper web-server.

*Step 1: Install Node.js and npm*

Download and install Node.js from nodejs.org.

*Step 2: Install http-server*

Open your terminal or command prompt and run:
<code>npm install -g http-server</code>

*Step 3: Start the local server*

Navigate to your project directory and start the server:
<code>cd /path/to/your/project</code> and then
<code>http-server</code>

*Step 4: Access your project in the browser*

Open your web browser and go to <code>http://localhost:8080/LiveCameraResult.html</code>.

### Configuring Azure Connection
To set up a connection with the Cognitive Services API, create a file <code>config.js</code> in the <code>js/</code> directory root with the code below. Fill in the correct endpoint URL and API key into the respective fields. Leave the code otherwise as is.
<pre><code>// config.js
export const API_URL = 'https://<span style="color:red">[Endpoint URL]</span>/vision/v3.2/describe'
export const API_KEY = '<span style="color:red">[API Key]</span>';</code></pre>