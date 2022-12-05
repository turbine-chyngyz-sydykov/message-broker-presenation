<script>
import {ref} from 'vue'

export default {
    setup() {
        const count = ref(0)
        const message = 'Hello world'
        const ws = new WebSocket("ws://localhost:3000/")

        // expose to template and other options API hooks
        return {
            count, message, ws
        }
    },
    mounted() {
        console.log(this.count) // 0
    },
    created() {
        try {
            this.ws.onmessage = ({data}) => {
                this.message = data;
                console.log('message', this.message);
            }
            this.ws.onopen = ({data}) => {
                console.log("Successfully connected to the echo websocket server...", data)
            }
            this.ws.onclose = ({data}) => {
                console.log("Closed connected to the echo websocket server...", data)
            }
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        sendMessage: function () {
            console.log("sendMessage", this.count)
            this.ws.send(this.count.toString());
        },
        closeConnection: function () {
            console.log("closeConnection")
            this.ws.close();
        },
        // openConnection: function () {
        //     console.log("closeConnection")
        //     this.ws.onopen();
        // }
    },
}
</script>

<template>
    <h1>{{ message }}</h1>

    <div class="card">
        <button type="button" @click="count++">count is {{ count }}</button>
        <Br/>
        <button type="button" @click="sendMessage()" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">SendMessage</button>
        <Br/>
<!--        <button type="button" @click="openConnection()" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Open</button>-->
        <Br/>
        <button type="button" @click="closeConnection()" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Close</button>
        <p>
            Edit
            <code>components/HelloWorld.vue</code> dddd
        </p>
    </div>
</template>
