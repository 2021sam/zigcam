require('dotenv').config();
const mqtt = require('mqtt');
const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const TO_EMAIL = process.env.TO_EMAIL;

const mqttBroker = 'mqtt://localhost'; // Adjust if necessary
const mqttTopic = 'zigbee2mqtt/0x286d9700010d9cd0'; // Replace with your topic

const transporter = nodemailer.createTransport({
  service: 'gmail', // Change if you're using a different email service
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Function to send email
function sendEmail(subject, body) {
  const mailOptions = {
    from: EMAIL_USER,
    to: TO_EMAIL,
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
const client = mqtt.connect(mqttBroker);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(mqttTopic, (err) => {
    if (err) {
      console.error('Error subscribing to topic:', err);
    }
  });
});

client.on('message', (topic, message) => {
  const payload = JSON.parse(message.toString());
  const contactStatus = payload.contact;

  // Check if contact status changed
  const subject = 'Contact Sensor Alert';
  let body = `Contact sensor status changed. Current status: ${JSON.stringify(payload)}`;
  
  if (!contactStatus) {
    body = `Door opened! ${body}`; // Customize the message for open
  } else {
    body = `Door closed! ${body}`; // Customize the message for closed
  }

  // Send email for both states
  sendEmail(subject, body);
});

// Handle errors
client.on('error', (err) => {
  console.error('MQTT error:', err);
});
