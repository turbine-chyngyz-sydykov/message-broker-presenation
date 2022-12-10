import { createServer } from "http";
import { Server } from "socket.io";
import express, {response} from "express";
const app = express();
const httpServer = createServer(app);
import {subscribe, publish, xReadAll, xReadOneByOne, xReadLastMessage} from "./redisHelper.js";
const io = new Server(httpServer, {});

const pubChannelName = 'pub-channel';
const streamAllChannelName = 'stream-all-channel';
const streamSingleChannel = 'stream-single-channel';
const streamLastMessageChannel = 'stream-last-message-channel';
const redisPobChannel = 'notifications';

(async () => {
    await subscribe(redisPobChannel, (message) => {
        console.log('sub: ', message)
        io.emit(pubChannelName, message);
    });
})();

function getMessages(response, channel) {
    for (const [key, value] of Object.entries(response)) {
        if (value.name === channel) {
            return value.messages;
        }
    }
}
async function getStreamMessagesByOne(currentId, isFinished) {
    let message = 'no new entry';
    if (!isFinished) {
        await xReadOneByOne('mystream', currentId, (response) => {
            if (response === 'no new entry'){
                io.emit(streamSingleChannel, response);
            }
            else{
                getMessages(response, 'mystream');

                const messages = getMessages(response, 'mystream');
                currentId = response[0].messages[0].id;
                message = messages[0].id + ': ' + messages[0].message.name;
                console.log('stream by one:', message)
                io.emit(streamSingleChannel, message);
                setTimeout(() => {
                    getStreamMessagesByOne(currentId, false)
                }, 1000);
            }

        });
    }
    else {
        io.emit(streamSingleChannel, message);
    }

}

io.on("connection", async (socket) => {

    const action = socket.handshake.query.action ?? 'pub';
    console.log('user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });


    if (action === 'pub') {
        socket.on(pubChannelName, async (message) => {
            console.log('pub: ' + message);
            await publish(redisPobChannel, message);
        });
    }

    else if (action === 'stream') {
        await xReadAll('mystream', (response)=>{
            getMessages(response, 'mystream');

            const messages = getMessages(response, 'mystream');

            const returningMessages = [];

            for (const [key, singleMessage] of Object.entries(messages)) {
                returningMessages.push(singleMessage.id + ': ' + singleMessage.message.name)
            }
            console.log('xReadAll: ', returningMessages)
            io.emit(streamAllChannelName, returningMessages);
        });
    }

    else if (action === 'stream-by-one') {
        let currentId = '0';
        let finished = false;
        await getStreamMessagesByOne(currentId, finished);
    }

    else if (action === 'stream-last-message') {
        socket.on(streamLastMessageChannel, async (message) => {
            await xReadLastMessage('mystream', (response)=> {
                const messages = getMessages(response, 'mystream');
                const message = response[0].messages[0].id + ': ' + messages[0].message.name;
                console.log('xReadLastMessage',message);
                io.emit(streamLastMessageChannel, message);
            });
        });

    }

});

httpServer.listen(3000, () => {
    console.log('listening on *:3000');
});
