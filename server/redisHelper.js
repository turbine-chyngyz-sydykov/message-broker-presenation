import redis from "redis"

// Configuration: adapt to your environment
const REDIS_SERVER = "redis://localhost:6379";
const REDIS_CHANNEL = "notifications";

//broadcast on web socket when receving a Redis PUB/SUB Event
export async function publish(message, channel) {
    console.log('publish', message);
    const redisClient = redis.createClient(REDIS_SERVER);
    await redisClient.connect();
    await redisClient.publish(channel, message);
}

export async function subscribe(callBack, channel) {
    const redisClient = redis.createClient();
    await redisClient.connect();
    await redisClient.subscribe(channel, (message) => {
        callBack(message);
    });
}
export function test() {
    console.log('test')
}
