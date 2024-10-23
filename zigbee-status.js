const mqtt = require('mqtt');

// MQTT server URL
const mqttServer = 'mqtt://localhost'; // Change if your MQTT broker is on a different server
const options = {
  clientId: 'zigbee-client',
  clean: true,
};

// Connect to the MQTT broker
const client = mqtt.connect(mqttServer, options);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Subscribe to Zigbee2MQTT topics
  client.subscribe('zigbee2mqtt/0x286d9700010d9cd0', (err) => {
    if (!err) {
      console.log('Subscribed to Zigbee2MQTT status updates');
    } else {
      console.error('Subscription error:', err);
    }
  });
});

client.on('message', (topic, message) => {
  // message is a Buffer
  const status = message.toString();
  console.log(`Received message from ${topic}:`, status);
});

client.on('error', (error) => {
  console.error('MQTT error:', error);
});
