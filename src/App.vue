<script setup lang="ts">
import { ref, computed } from 'vue';
import Calendar from './components/Calendar.vue';
import TodoInput from './components/TodoInput.vue';
import AddTodoModal from './components/Modal.vue';
import { useTodoStore } from './todoStore';

// --- ストアの利用 ---
const todoStore = useTodoStore();

// 選択されている日付
const selectedDate = ref(new Date());

// モーダルの表示状態を管理する変数
const isModalOpen = ref(false);

// --- ヘルパー関数 ---
const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// --- 算出プロパティ ---

// 選択された日付のキー (YYYY-MM-DD)
const selectedDateKey = computed(() => {
  return toDateKey(selectedDate.value);
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
    weekday: 'short',
  });
});

// --- イベントハンドラ ---

// 日付が更新された時
const updateSelectedDate = (date: Date) => {
  selectedDate.value = date;
};

// Todoを追加
const handleAddTodo = (text: string, time: string) => {
  todoStore.addTodo(selectedDateKey.value, text, time);
};

// Todoの完了状態を切り替え
const handleToggleTodo = (id: number) => {
  todoStore.toggleTodo(selectedDateKey.value, id);
};

// Todoを削除
const handleRemoveTodo = (id: number) => {
  todoStore.removeTodo(selectedDateKey.value, id);
};

// モーダルを開く
const openAddTodoModal = () => {
  isModalOpen.value = true;
};

// モーダル内でタスクが追加された時に実行
const confirmAddTodo = (todoData: { text: string; time: string }) => {
  const { text, time } = todoData;
  if (text.trim() === '') return;
  handleAddTodo(text, time);
  isModalOpen.value = false; // モーダルを閉じる
};

// モーダルを閉じる
const closeModal = () => {
  isModalOpen.value = false;
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
          <h2 class="text-2xl font-bold text-gray-800 mb-8">
            {{ formattedDate }}
          </h2>
          <TodoInput @openModal="openAddTodoModal" />
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
                <div class="flex flex-col">
                  <span class="text-sm text-gray-500">
                    {{ todo.time }}
                  </span>
                  <span :class="{ 'line-through text-gray-400': todo.completed, 'text-gray-800': !todo.completed }">
                    {{ todo.text }}
                  </span>
                </div>
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
    <AddTodoModal v-if="isModalOpen" @confirm="confirmAddTodo" @close="closeModal" />
  </div>
</template>

<style>
/* スタイルに変更はありません */
</style>