import './config.js';
import './camera.js';
import './jquery.min.js';
import './styles.css';

// Initialize the camera on page load
import { cameraStart } from './camera.js';

document.addEventListener('DOMContentLoaded', (event) => {
    // Ensure cameraStart is called only once
    if (typeof window.cameraInitialized === 'undefined') {
        window.cameraInitialized = true;
        cameraStart();
    }
});
