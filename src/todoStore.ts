import { defineStore } from 'pinia';
import { ref } from 'vue';

// Todoアイテムの型定義
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  time: string;
}

// ストアの定義
export const useTodoStore = defineStore('todoStore', () => {
  // --- State (データ) ---
  const todos = ref<Record<string, Todo[]>>({});

  // --- Actions (操作) ---

  // 新しいTodoを追加
  const addTodo = (dateKey: string, text: string, time: string) => {
    if (!todos.value[dateKey]) {
      todos.value[dateKey] = [];
    }
    todos.value[dateKey].push({
      id: Date.now(),
      text,
      completed: false,
      time,
    });
  };

  // Todoの完了状態を切り替え
  const toggleTodo = (dateKey: string, id: number) => {
    const todo = todos.value[dateKey]?.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  };

  // Todoを削除
  const removeTodo = (dateKey: string, id: number) => {
    if (todos.value[dateKey]) {
      todos.value[dateKey] = todos.value[dateKey].filter(t => t.id !== id);
    }
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
  };
}, {
  persist: true,
});