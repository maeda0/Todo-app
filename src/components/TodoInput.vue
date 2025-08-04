<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['openModel']);

const openModal = () => {
  emit('openModel');
};

</script>

<template>
  <div
    @click="openModal"
    class="flex-grow p-3 mb-6 bg-blue-500 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-400 transition-colors"
  >
    <span class="text-white">新しいタスクを追加...</span>
  </div>
</template>
