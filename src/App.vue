<script setup lang="ts">
import { ref, computed } from 'vue'; // onMountedを削除
import Calendar from './components/Calendar.vue';
import TodoInput from './components/TodoInput.vue';
import { useTodoStore } from './todoStore';

// --- ストアの利用 ---
const todoStore = useTodoStore();

// 選択されている日付
const selectedDate = ref(new Date());

// --- 算出プロパティ ---

// 選択された日付のキー (YYYY-MM-DD)
const selectedDateKey = computed(() => {
  return selectedDate.value.toISOString().split('T')[0];
});

// 選択された日付のToDoリスト
const selectedDayTodos = computed(() => {
  return todoStore.todos[selectedDateKey.value] || [];
});

// フォーマットされた日付
const formattedDate = computed(() => {
  return selectedDate.value.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// --- イベントハンドラ ---

// 日付が更新された時
const updateSelectedDate = (date: Date) => {
  selectedDate.value = date;
};

// Todoを追加
const handleAddTodo = (text: string) => {
  todoStore.addTodo(selectedDateKey.value, text);
};

// Todoの完了状態を切り替え
const handleToggleTodo = (id: number) => {
  todoStore.toggleTodo(selectedDateKey.value, id);
};

// Todoを削除
const handleRemoveTodo = (id: number) => {
  todoStore.removeTodo(selectedDateKey.value, id);
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-5xl h-[650px] flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-lg p-8">

      <div class="w-full lg:w-1/2 flex justify-center">
        <Calendar 
          :todos="todoStore.todos"
          :selectedDate="selectedDate" 
          @update:selectedDate="updateSelectedDate"
         />
      </div>

      <div class="w-full lg:w-1/2 flex flex-col">
        <div class="w-full bg-white h-[700px] rounded-xl shadow-md p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-1">
            {{ formattedDate }}
          </h2>
          <p class="text-gray-500 mb-6">のタスク</p>
          <TodoInput @addTodo="handleAddTodo" />
          <div class="space-y-3 overflow-y-auto h-64 pr-2">
            <p v-if="selectedDayTodos.length === 0" class="text-gray-500 text-center mt-8">
              この日のタスクはありません。
            </p>
            <div
              v-for="todo in selectedDayTodos"
              :key="todo.id"
              @click="handleToggleTodo(todo.id)"
              class="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              :class="{ 'opacity-50': todo.completed }"
            >
              <div class="flex-grow flex items-center">
                <input type="checkbox" :checked="todo.completed" class="mr-4 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                <span :class="{ 'line-through text-gray-400': todo.completed, 'text-gray-800': !todo.completed }">
                  {{ todo.text }}
                </span>
              </div>
              <button @click.stop="handleRemoveTodo(todo.id)" class="text-red-400 hover:text-red-600 ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* スタイルに変更はありません */
</style>