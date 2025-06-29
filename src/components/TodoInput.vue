<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const newTodoText = ref('');
const emit = defineEmits(['addTodo']);

const submitTodo = () => {
  if (newTodoText.value.trim() === '') return;
  emit('addTodo', newTodoText.value.trim());
  newTodoText.value = '';
};
</script>

<template>
  <form @submit.prevent="submitTodo" class="flex gap-2 mb-6">
    <input
      v-model="newTodoText"
      type="text"
      placeholder="新しいタスクを追加..."
      class="flex-grow p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
    />
    <button
      type="submit"
      class="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
    >
      追加
    </button>
  </form>
</template>
