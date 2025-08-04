import { defineStore } from 'pinia';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  time: string;
  allDay: boolean;
}

interface State {
  todos: Record<string, Todo[]>;
}

export const useTodoStore = defineStore('todo', {
  state: (): State => {
    // ページ読み込み時にlocalStorageからデータを復元
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        return { todos: JSON.parse(savedTodos) };
      } catch (e) {
        console.error('localStorageからのデータ読み込みに失敗しました:', e);
      }
    }
    // データがない場合は初期状態を返す
    return {
      todos: {},
    };
  },
  actions: {
    /**
     * 現在の状態をlocalStorageに保存する内部関数
     */
    _saveState() {
      try {
        localStorage.setItem('todos', JSON.stringify(this.todos));
      } catch (e) {
        console.error('localStorageへのデータ保存に失敗しました:', e);
      }
    },

    /**
     * 新しいTodoを追加
     */
    addTodo(dateKey: string, text: string, time: string = '', allDay: boolean = false) {
      const newTodo = { id: Date.now(), text, completed: false, time, allDay };
      
      // 既存の配列のコピーを作成し、新しいTodoを追加するか、新しい配列を作成
      const updatedDayTodos = this.todos[dateKey] ? [...this.todos[dateKey], newTodo] : [newTodo];
      
      // todosオブジェクト全体のコピーを作成し、更新後の日付配列で置き換える
      this.todos = {
        ...this.todos,
        [dateKey]: updatedDayTodos
      };
      
      this._saveState();
    },

    /**
     * Todoの完了状態を切り替え
     */
    toggleTodo(dateKey: string, id: number) {
      if (!this.todos[dateKey]) return;

      // mapを使って新しい配列を作成し、該当するtodoのcompletedプロパティを反転
      this.todos[dateKey] = this.todos[dateKey].map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );

      this._saveState();
    },

    /**
     * Todoを削除
     */
    removeTodo(dateKey: string, id: number) {
      if (!this.todos[dateKey]) return;

      // filterを使って新しい配列を作成
      const updatedDayTodos = this.todos[dateKey].filter(todo => todo.id !== id);

      // もしその日のタスクがすべてなくなったら、日付キーごと削除する
      if (updatedDayTodos.length > 0) {
        this.todos[dateKey] = updatedDayTodos;
      } else {
        // todosオブジェクトのコピーを作成してから、キーを削除する
        const newTodos = { ...this.todos };
        delete newTodos[dateKey];
        this.todos = newTodos;
      }
      
      this._saveState();
    },
  },
});