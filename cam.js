const axios = require('axios');

// Replace with your camera's IP address, username, and password
const CAMERA_IP = 'http://10.0.0.4'; // e.g., 'http://192.168.1.100'
const USERNAME = 'admin';
const PASSWORD = '';

async function startRecording() {
    try {
        const response = await axios.get(`${CAMERA_IP}/cgi-bin/api.cgi?action=startRecord`, {
            auth: {
                username: USERNAME,
                password: PASSWORD,
            },
        });
        console.log('Recording started:', response.data);
    } catch (error) {
        console.error('Error starting recording:', error);
    }
}

async function stopRecording() {
    try {
        const response = await axios.get(`${CAMERA_IP}/cgi-bin/api.cgi?action=stopRecord`, {
            auth: {
                username: USERNAME,
                password: PASSWORD,
            },
        });
        console.log('Recording stopped:', response.data);
    } catch (error) {
        console.error('Error stopping recording:', error);
    }
}

// Example usage: Start and stop recording with a timeout
async function controlRecording() {
    await startRecording();
    console.log('Recording for 10 seconds...');
    setTimeout(async () => {
        await stopRecording();
    }, 10000); // Stop recording after 10 seconds
}

// Call the control function
controlRecording();
