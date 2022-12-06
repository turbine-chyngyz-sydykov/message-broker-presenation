import { WebSocketServer } from 'ws';
import { subscribe, publish, test } from "./redisHelper.js"

// Configuration: adapt to your environment
const WEB_SOCKET_PORT = 3000;

// Connect to Redis and subscribe to "app:notifications" channel


// Create & Start the WebSocket server
const server = new WebSocketServer({port: WEB_SOCKET_PORT});



server.on("connection", (ws,request) => {
    const myURL = new URL(request.headers.origin + request.url);
    const channel = myURL.searchParams.get('channel');

    console.log("new client connected", channel);
    ws.send('welcome message from server');

    // getting message from redis
    subscribe((message) => {
        console.log('subscribe', message);
        ws.send(message);
    }, channel)

    // getting message from client
    ws.on("message", message => {
        console.log(`Client has sent us: ${message}`);
        publish(message, channel);
    });

    // handling what to do when clients disconnects from server
    server.on("close", () => {
        console.log("the client closed");
    });
    server.on("disconnect", () => {
        console.log("the client disconnected");
    });
    // handling client connection error
    server.onerror = function () {
        console.log("Some Error occurred")
    }
});

console.log("WebSocket server started at ws://locahost:" + WEB_SOCKET_PORT);
