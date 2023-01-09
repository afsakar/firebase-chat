<script setup>
import {useAuth} from "@/firebase.js";
import {computed} from "vue";

const {user} = useAuth();

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const messageHour = computed(() => {
  return new Date(props.message.createdAt.seconds*1000).toLocaleTimeString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
  });
})

function convertTimestamp(timestamp) {
  let date = timestamp.toDate();
  let mm = date.getMonth('tr-TR') + 1;
  let dd = date.getDate();
  let yyyy = date.getFullYear();
  let hh = date.getHours();
  let min = date.getMinutes();

  date = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min;
  return date;
}
</script>

<template>
  <div v-if="user?.uid !== message.uid" class="flex w-full mt-2 space-x-3 max-w-sm">
    <div class="flex items-start justify-start gap-2 w-96">
      <NAvatar :src="message.photoURL" round/>
      <div class="flex-1 items-center justify-start gap-2">
        <span class="font-semibold">{{ message.displayName ?? 'Anonymous' }}</span>
        <div class="bg-gradient-to-br from-cyan-600 to-blue-600 p-2 text-justify text-white rounded-lg rounded-tl-none shadow-lg">
          <span>{{ message.text }}</span>
        </div>
        <span class="text-gray-400 italic text-xs">
        {{convertTimestamp(message.createdAt)}}
      </span>
      </div>
    </div>
  </div>

  <div v-else class="flex w-full mt-2 space-x-3 max-w-sm ml-auto justify-end">
    <div class="flex flex-row-reverse items-start justify-end gap-2 w-96">
      <NAvatar :src="message.photoURL" round/>
      <div class="flex-1 items-center justify-end gap-2 text-right">
        <div class="bg-gradient-to-br from-green-600 to-emerald-600 p-2 text-justify text-white rounded-lg rounded-tr-none shadow-lg">
          <span>{{ message.text }}</span>
        </div>
        <span class="text-gray-400 italic text-xs">
        {{convertTimestamp(message.createdAt)}}
      </span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>