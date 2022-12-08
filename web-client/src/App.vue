<script setup>
import Subscriber from './components/Subscriber.vue'
import StreamMessagesByOne from './components/StreamMessagesByOne.vue'
import StreamAllMessages from './components/StreamAllMessages.vue'
import StreamLastMessage from "./components/StreamLastMessage.vue";
</script>

<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
    <div class="grid grid-cols-3 gap-4">
        <Subscriber/>
        <Subscriber/>
        <Subscriber/>

        <StreamAllMessages/>
        <StreamMessagesByOne/>
        <StreamLastMessage/>
    </div>
</template>
