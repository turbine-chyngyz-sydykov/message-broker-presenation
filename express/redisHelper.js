import redis from "redis"

// Configuration: adapt to your environment
const REDIS_SERVER = "redis://localhost:6379";
const redisClient = redis.createClient(REDIS_SERVER);

export async function publish(channel, message) {

    console.log('pub: ' + message, channel);
    const publisher = redisClient.duplicate();
    await publisher.connect();
    await publisher.publish(channel, message);
}

export async function disconnect() {
    await this.redisClient.disconnect();
}

export async function subscribe(channel, callBack) {
    const subscriber = redisClient.duplicate();
    await subscriber.connect();
    console.log('sub: ', channel);
    await subscriber.subscribe(channel, (message) => {
        callBack(message);
    });
}

export async function xReadAll(stream, callBack) {
    const streamAll = redisClient.duplicate();
    await streamAll.connect();
    const response = await streamAll.xRead(
        redis.commandOptions({
            isolated: true
        }),
        [
            {
                key: 'mystream',
                id: '0'
            }
        ],
        {
            BLOCK: 0
        }
    );

    if (response) {
        console.log('stream-all: ', response);
        callBack(response);
    } else {
        console.log('No new stream entries.');
    }
}
export async function xReadOneByOne(stream, currentId, callBack) {
    const streamOne = redisClient.duplicate();
    await streamOne.connect();
    console.log('xRead', stream, currentId);
    let response = await streamOne.xRead(
        redis.commandOptions({
            isolated: true
        }),
        [
            {
                key: stream,
                id: currentId
            }
        ],
        {
            COUNT: 2,
        }
    );

    if (response) {
        callBack(response);
    } else {
        callBack('no new entry');
    }
}
export async function xReadLastMessage(stream, callBack) {
    const streamOne = redisClient.duplicate();
    await streamOne.connect();
    let response = await streamOne.xRead(
        redis.commandOptions({
            isolated: true
        }),
        [
            {
                key: stream,
                id: '$'
            }
        ],
        {
            BLOCK: 0,
            COUNT: 1,
        }
    );

    if (response) {
        callBack(response);
    } else {
        console.log('No new stream entries.');
    }
}
//
//
//
// async xAdd() {
//     const redisClient = redis.createClient(REDIS_SERVER);
//     await redisClient.connect();
//     for(let i = 0; i < 10; i++) {
//         await redisClient.sendCommand(['XADD', 'mystream', '*', 'name', faker.name.firstName()], function(err, reply) {
//             console.log(err, reply);
//         });
//     }
// }
