const WebSocket = require('ws');
const redis = require('redis');

// Configuration: adapt to your environment
const REDIS_SERVER = "redis://localhost:6379";
const REDIS_CHANNEL = "notifications";
const WEB_SOCKET_PORT = 3000;

// Connect to Redis and subscribe to "app:notifications" channel


// Create & Start the WebSocket server
const server = new WebSocket.Server({port: WEB_SOCKET_PORT});

// Register event for client connection
server.on("connection", ws => {
    console.log("new client connected");

    let inc = 1;
    setTimeout(function(){
        const D = 'server';
        ws.send(D+inc);
        console.log(D+inc);
        inc++;
    }, 2000);

    //broadcast on web socket when receving a Redis PUB/SUB Event

    (async () => {
        console.log('sssss', redis);
        const publisher = redis.createClient(REDIS_SERVER);
        await publisher.connect();
        await publisher.publish(REDIS_CHANNEL, 'server');
    })();

    (async () => {
        console.log('dddd', redis);
        const subscriber = redis.createClient();
        await subscriber.connect();
        await subscriber.subscribe(REDIS_CHANNEL, (message) => {
            console.log(message);
            ws.send(message);
        });
    })();





    // redisClient.subscribe('app:notifications');
    // redisClient.on('message', function(channel, message){
    //     console.log('redis', channel, message);
    //     ws.send(message);
    // })

    // sending message to client
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
    });
    // handling what to do when clients disconnects from server
    server.on("close", () => {
        console.log("the client has connected");
    });
    // handling client connection error
    server.onerror = function () {
        console.log("Some Error occurred")
    }
});


// server.on('connection', function connection(ws) {
//     console.log(ws);
    //broadcast on web socket when receving a Redis PUB/SUB Event
    // redisClient.on('message', function(channel, message){
    //     console.log(message);
    //     ws.send(message);
    // })
//
// });

console.log("WebSocket server started at ws://locahost:" + WEB_SOCKET_PORT);
