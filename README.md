# Azure Cognitive Services Demo

## Description
This project implements object recognition using a local webcam and the Computer Vision API from Azure Cognitive Services. It detects if a person is wearing a headset and show the result on the webpage. It uploads images where no headset is worn to blob storage if the <code>Upload images to Blob Storage</code> checkbox is checked. The rate with which images are sent to Cognitive Services for analysis can be selected with the corresponding slider.

## Running this project

### Configuring Azure Connection
To set up a connection with the Cognitive Services API and the Azure Blob Storage, create a file <code>config.js</code> in the <code>src/</code> directory with the code below. You can also find an example in <code>/src/config_sample.js</code>. Fill in the correct values into the respective fields marked red.
<pre><code>// config.js
export const API_URL = 'https://<span style="color:red">[Endpoint URL]</span>'
export const API_KEY = '<span style="color:red">[API Key]</span>';
export const STORAGE_ACCOUNT_NAME = '<span style="color:red">[Storage account name]</span>';
export const CONTAINER_NAME = '<span style="color:red">[Container name]</span>';
export const SAS_TOKEN = '?<span style="color:red">[SAS token]</span>'; // leave the question mark before the SAS token</code></pre>

## Setting up the environment

### Install fnm
https://nodejs.org/en/download/package-manager

Install fnm: <code>winget install Schniz.fnm</code>

Set up your PowerShell environment for fnm:
Run <code>notepad $profile</code> and then add the following to the file: <code>fnm env | Out-String | Invoke-Expression</code>

### Install NodeJS using fnm
Install node version 22: <code>fnm install 22</code>

Check that node was installed correctly: <code>node -v</code>

Install all required node packages: <code>npm install</code>

## Build and run the project
Build: <code>npm run build</code>

Run: <code>npm start</code>