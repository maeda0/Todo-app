<script setup lang="ts">
import { ref, defineEmits, watch } from 'vue';

const newTodoText = ref('');
// モーダルが開かれた時点の時刻を初期値として設定
const newTodoTime = ref(`${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`);
const isAllDay = ref(false);
const emit = defineEmits(['confirm', 'close']);

// isAllDayの値の変更を監視
watch(isAllDay, (isAllDayChecked) => {
  if (isAllDayChecked) {
    // 終日にチェックが入ったら時間をクリアし、入力欄を「--:--」に見せる
    newTodoTime.value = '';
  } else {
    // チェックが外れたら、現在の時刻を再取得して設定する
    const now = new Date();
    newTodoTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
});

const submitTodo = () => {
  emit('confirm', {
    text: newTodoText.value.trim(),
    time: isAllDay.value ? '' : newTodoTime.value,
    allDay: isAllDay.value
  });
};

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-2xl font-bold">新しいタスクを追加</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="submitTodo" class="space-y-4">

        <div class="flex flex-col gap-2">
          <label for="todo-text" class="text-sm font-medium text-gray-700">タスク名</label>
          <input
            id="todo-text"
            v-model="newTodoText"
            type="text"
            placeholder="タスクを入力してください"
            class="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="todo-time" class="text-sm font-medium text-gray-700">時間</label>
          <input
            id="todo-time"
            v-model="newTodoTime"
            type="time"
            placeholder="--:--"
            class="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            :class="{ 'bg-gray-200 text-gray-500': isAllDay }"
            :disabled="isAllDay"
          />
        </div>
        
        <div class="flex items-center">
          <input
            id="all-day"
            v-model="isAllDay"
            type="checkbox"
            class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2"
          />
          <label for="all-day" class="text-sm text-gray-700">終日</label>
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <button
            type="button"
            @click="closeModal"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            :disabled="newTodoText.trim() === ''"
            class="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            追加
          </button>
        </div>
      </form>
    </div>
  </div>
</template>