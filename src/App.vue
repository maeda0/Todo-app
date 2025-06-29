<script setup lang="ts">
import { ref, computed } from 'vue';
// v-calendarのCSSをインポートします
import 'v-calendar/style.css';

// Todoアイテムの型定義
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// 選択されている日付（v-modelで使用）
const selectedDate = ref(new Date());

// 新しいTodoのテキスト入力
const newTodoText = ref('');

// 全てのTodoを格納するオブジェクト
// キーは日付 (YYYY-MM-DD), 値はその日のTodo配列
const todos = ref<Record<string, Todo[]>>({
  // 初期データ例
  [new Date().toISOString().split('T')[0]]: [
    { id: 1, text: 'Vueの学習', completed: false },
    { id: 2, text: 'v-calendarを試す', completed: true },
  ]
});

// 選択されている日付に対応するTodoリストを計算する算出プロパティ
const selectedDayTodos = computed(() => {
  const dateKey = selectedDate.value.toISOString().split('T')[0];
  return todos.value[dateKey] || [];
});

// 日付をフォーマットするヘルパー関数 (例: 2023年7月15日)
const formattedDate = computed(() => {
  return selectedDate.value.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// 新しいTodoを追加する関数
const addTodo = () => {
  if (newTodoText.value.trim() === '') return;

  const dateKey = selectedDate.value.toISOString().split('T')[0];
  if (!todos.value[dateKey]) {
    todos.value[dateKey] = [];
  }

  todos.value[dateKey].push({
    id: Date.now(), // ユニークIDとしてタイムスタンプを使用
    text: newTodoText.value,
    completed: false,
  });

  newTodoText.value = ''; // 入力欄をクリア
};

// Todoの完了状態を切り替える関数
const toggleTodo = (id: number) => {
  const dateKey = selectedDate.value.toISOString().split('T')[0];
  const todo = todos.value[dateKey]?.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
};

// Todoを削除する関数
const removeTodo = (id: number) => {
  const dateKey = selectedDate.value.toISOString().split('T')[0];
  if(todos.value[dateKey]){
      todos.value[dateKey] = todos.value[dateKey].filter(t => t.id !== id);
  }
};

// カレンダーに表示するドットの属性を計算
const attrs = computed(() => [
  {
    key: 'today',
    highlight: true,
    dates: new Date(),
  },
  {
    key: 'todos',
    dot: 'blue',
    dates: Object.keys(todos.value).filter(dateKey => todos.value[dateKey].length > 0).map(dateKey => new Date(dateKey)),
  },
]);

</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-4xl flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-lg p-8">

      <!-- 左側: カレンダー -->
      <div class="w-full lg:w-1/2 flex justify-center">
        <VDatePicker
          v-model="selectedDate"
          :attributes="attrs"
          :is-required="true"
          title-position="left"
          borderless
          transparent
        />
      </div>

      <!-- 右側: Todoリスト -->
      <div class="w-full lg:w-1/2 flex flex-col">
        <h2 class="text-2xl font-bold text-gray-800 mb-1">
          {{ formattedDate }}
        </h2>
        <p class="text-gray-500 mb-6">のタスク</p>

        <!-- Todo追加フォーム -->
        <form @submit.prevent="addTodo" class="flex gap-2 mb-6">
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

        <!-- Todoリスト表示 -->
        <div class="space-y-3 overflow-y-auto h-64 pr-2">
          <p v-if="selectedDayTodos.length === 0" class="text-gray-500 text-center mt-8">
            この日のタスクはありません。
          </p>
          <div
            v-for="todo in selectedDayTodos"
            :key="todo.id"
            @click="toggleTodo(todo.id)"
            class="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            :class="{ 'opacity-50': todo.completed }"
          >
            <div class="flex-grow flex items-center">
               <input type="checkbox" :checked="todo.completed" class="mr-4 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <span :class="{ 'line-through text-gray-400': todo.completed, 'text-gray-800': !todo.completed }">
                {{ todo.text }}
              </span>
            </div>
             <button @click.stop="removeTodo(todo.id)" class="text-red-400 hover:text-red-600 ml-4">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
