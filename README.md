# Vue 3 + Socket.io + Nodejs server + Redis

This is an example code for devfest 2022 bishkek presentation

## Recommended IDE Setup

in order to run the code do following

1) running Redis
```
docker run -it --rm --name redis-server -p 6379:6379 redis
docker exec -it redis-server redis-cli
```
2) running Express.js
```
cd express/
npm install
nodemon index.js
```

3) running Vue
```
cd web-client/
npm install
npm run dev
```
Notes that were used for presentation

publish notifications "message"
subscribe notifications

xadd mystream * name "name1"

XREAD BLOCK 0 STREAMS mystream $

XGROUP CREATE mystream mygroup $

XREADGROUP GROUP mygroup Alice COUNT 1 STREAMS mystream > #reads last messages from stream and assigns itself to it

XREADGROUP GROUP mygroup Alice STREAMS mystream 0 #shows messages that assigned to current user

XPENDING mystream mygroup

XPENDING mystream mygroup - + 10

XCLAIM mystream mygroup Alice 0 1670510194079-0

XACK mystream mygroup 1526569495631-0
