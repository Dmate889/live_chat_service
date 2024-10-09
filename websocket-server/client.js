//This backend script is dedicated to test the server-side ping-pong WS healthcheck

const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

//Client is connecting to the server
ws.on('open', () => {
    console.log('Client has connected to the server');

    ws.send('Hello server!');
});

//Client sends a message
ws.on('message', (msg) => {
    console.log(`Message from the server: ${msg}`);
});

//Client is 'losing' connection from the server. After this point it should not receive the 'ping', and would not send the 'pong' response
setTimeout(() => {
    console.log('Simulating connection loss to the server');
    ws.terminate();

}, 10000);