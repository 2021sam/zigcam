require('dotenv').config(); // Load .env file
const nodemailer = require('nodemailer');
const fs = require('fs');
const { exec } = require('child_process');

// Define file paths and camera settings
const videoFilePath = process.env.VIDEO_PATH; // Get from .env
const recipientEmail = process.env.RECIPIENT_EMAIL; // Get recipient email from .env
const cameraIp = process.env.CAMERA_IP; // Get camera IP from .env
const cameraUsername = process.env.CAMERA_USERNAME; // Get camera username from .env
const cameraPassword = process.env.CAMERA_PASSWORD; // Get camera password from .env

// Function to start recording
function startRecording() {
    // Start recording command
    exec(`curl -u ${cameraUsername}:${cameraPassword} "http://${cameraIp}/start_recording"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting recording: ${error.message}`);
            return;
        }
        console.log(`Recording started: ${stdout}`);
    });
}

// Function to stop recording
function stopRecording() {
    // Stop recording command
    exec(`curl -u ${cameraUsername}:${cameraPassword} "http://${cameraIp}/stop_recording"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error stopping recording: ${error.message}`);
            return;
        }
        console.log(`Recording stopped: ${stdout}`);
        sendEmail(videoFilePath); // Send the email after stopping
    });
}

// Function to send email with video attachment
async function sendEmail(videoPath) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    let mailOptions = {
        from: `"Your Name" <${process.env.SMTP_USER}>`,
        to: recipientEmail, // Use recipient from .env
        subject: 'Video from Reolink Camera',
        text: 'Please find the attached video.',
        attachments: [
            {
                path: videoPath
            }
        ]
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}

// Example usage
startRecording();

// Call stopRecording() when you want to stop recording, e.g., after a set duration
setTimeout(stopRecording, 6000); // Stop after 60 seconds
