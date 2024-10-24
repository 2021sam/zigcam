require('dotenv').config();
const mqtt = require('mqtt');
const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_RECIPIENTS = process.env.EMAIL_RECIPIENTS; // Comma-separated list
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost'; // Use environment variable
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'zigbee2mqtt/0x00158d0006f98451'; // Use environment variable

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Variable to keep track of the last known status
let lastContactStatus = null;

// Function to send email
function sendEmail(subject, body) {
  const recipients = EMAIL_RECIPIENTS.split(',');
  const mailOptions = {
    from: EMAIL_USER,
    to: recipients.join(','),
    subject: subject,
    text: body,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('Email sent:', info.response);
  });
}

// MQTT client setup
const client = mqtt.connect(MQTT_BROKER);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error('Error subscribing to topic:', err);
    }
  });
});

client.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    const contactStatus = payload.contact;

    // Check if contact status changed
    if (lastContactStatus !== contactStatus) {
      lastContactStatus = contactStatus; // Update last known status
      console.log('contactStatus: ', lastContactStatus);
      const subject = 'Contact Sensor Alert';
      const body = `Contact sensor status changed. Current status: ${JSON.stringify(payload)}\n` +
                   (contactStatus ? 'Door closed!' : 'Door opened!');

      sendEmail(subject, body);
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

// Handle errors
client.on('error', (err) => {
  console.error('MQTT error:', err);
});
