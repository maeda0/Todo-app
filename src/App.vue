<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import Calendar from './components/Calendar.vue'; // Calendarコンポーネントをインポート
import TodoInput from './components/TodoInput.vue'; // TodoInputコンポーネントをインポート

// Todoアイテムの型定義
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// 選択されている日付（v-modelで使用）
const selectedDate = ref(new Date());

// 全てのTodoを格納するオブジェクト
// キーは日付 (YYYY-MM-DD), 値はその日のTodo配列
const todos = ref<Record<string, Todo[]>>({});

// アプリケーションがマウントされた時にLocalStorageからデータを読み込む
onMounted(() => {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    try {
      todos.value = JSON.parse(savedTodos);
    } catch (e) {
      console.error("Failed to parse todos from localStorage:", e);
      todos.value = {};
    }
  } else {
    // 初回起動時やLocalStorageにデータがない場合の初期データ
    todos.value = {
      [new Date().toISOString().split('T')[0]]: [
        { id: 1, text: 'Vueの学習', completed: false },
        { id: 2, text: 'v-calendarを試す', completed: true },
      ]
    };
  }
});

// todos データが変更されたらLocalStorageに保存する
// オブジェクトの深い変更を監視するためにdeep: trueを設定
watch(todos, (newTodos) => {
  localStorage.setItem('todos', JSON.stringify(newTodos));
}, { deep: true });

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

// Calendarコンポーネントからの日付更新イベントを受け取る関数
const updateSelectedDate = (date: Date) => {
  selectedDate.value = date;
};

// 新しいTodoを追加する関数
// TodoInputコンポーネントからのaddTodoイベントを受け取る
const addTodo = (text: string) => {
  const dateKey = selectedDate.value.toISOString().split('T')[0];
  if (!todos.value[dateKey]) {
    todos.value[dateKey] = [];
  }
  todos.value[dateKey].push({
    id: Date.now(), // ユニークIDとしてタイムスタンプを使用
    text: text,
    completed: false,
  });
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
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-5xl h-[700px] flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-lg p-8">

      <!-- 左側: カレンダーコンポーネントを枠で囲む -->
      <div class="w-full lg:w-1/2 flex justify-center">
          <Calendar :todos="todos" @update:selectedDate="updateSelectedDate" />
      </div>

      <!-- 右側: Todoリストを枠で囲む -->
      <div class="w-full lg:w-1/2 flex flex-col">
        <div class="w-full bg-white rounded-xl shadow-md p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-1">
            {{ formattedDate }}
          </h2>
          <p class="text-gray-500 mb-6">のタスク</p>
          <TodoInput @addTodo="addTodo" />
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
  </div>
</template>

<style>

</style>
