

<template>
    <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
            <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Stream Messages by one</h2>
        </a>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">This is a compontent that is getting stream messages from redis->socket->vue</p>
        <div class="flex mt-4">
            <div class="relative w-full">
                <input type="text" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="channel" v-model="channel">
                <button v-if="!socket" type="button" @click="openConnection()"
                        class="text-white absolute right-2 bottom-2.5 bg-blue-700 font-medium rounded-lg text-sm px-2 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                </button>
                <button v-if="socket" type="button" @click="closeConnection()"
                        class="text-white absolute right-2 bottom-2.5 bg-red-700 font-medium rounded-lg text-sm px-2 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                </button>
            </div>
        </div>
        <h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Messages from server:</h2>
        <ul class="space-y-1 max-w-md list-disc list-inside text-gray-500 dark:text-gray-400">
            <li v-for="message in messages">
                {{ message }}
            </li>
        </ul>
    </div>
</template>

<script>
import SocketService from '../service/socket.js';

export default {
    name: "StreamMessagesByOne",

    data() {
        return {
            socket: null,
            channel: "stream-single-channel",
            messages: [],
            message: '',
        }
    },
    beforeUnmount() {
        this.socket.disconnect();
    },
    methods: {
        getMessage(message) {
            console.log('get message:',message);
            this.messages.push(message);
        },
        closeConnection: function () {
            this.socket.disconnect();
            this.socket = null;
            this.messages = [];
        },
        openConnection: function () {
            this.socket = new SocketService(this.channel,{
                'action':'stream-by-one'
            });
            this.socket.subscribe(this.getMessage)
        },
    }
}
</script>
