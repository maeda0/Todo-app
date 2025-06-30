<script setup lang="ts">
import { ref, computed, watch, defineEmits } from 'vue';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const props = defineProps<{
  todos: Record<string, Todo[]>;
}>();

const emit = defineEmits(['update:selectedDate']);

const currentMonth = ref(new Date()); // 現在表示している月
const selectedDate = ref(new Date()); // 選択されている日付

// selectedDateが変更されたら親コンポーネントに通知
watch(selectedDate, (newDate) => {
  emit('update:selectedDate', newDate);
});

// 月の変更関数
const changeMonth = (offset: number) => {
  const newDate = new Date(currentMonth.value);
  newDate.setMonth(newDate.getMonth() + offset);
  currentMonth.value = newDate;
};

// カレンダーの月と年をフォーマット
const formattedMonthYear = computed(() => {
  return currentMonth.value.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
  });
});

// 曜日名の配列
const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

// カレンダーの日付セルを生成
const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0:日, 1:月, ..., 6:土

  const days = [];

  // 前月の空白日
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

  // 今月の日付
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // 来月の空白日 (合計42セルになるように調整 - 6週表示のため)
  const totalCells = 42;
  for (let i = 1; days.length < totalCells; i++) {
      days.push(null); // ダミーの日付を追加
  }

  return days;
});

// 日付が今日かどうかを判定
const isToday = (date: Date | null) => {
  if (!date) return false;
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
};

// 日付が選択されている日付かどうかを判定
const isSelected = (date: Date | null) => {
  if (!date) return false;
  return date.getFullYear() === selectedDate.value.getFullYear() &&
         date.getMonth() === selectedDate.value.getMonth() &&
         date.getDate() === selectedDate.value.getDate();
};

// その日にTodoがあるかどうかを判定
const hasTodo = (date: Date | null) => {
  if (!date) return false;
  const dateKey = date.toISOString().split('T')[0];
  return props.todos[dateKey] && props.todos[dateKey].length > 0;
};

// 日付セルがクリックされた時の処理
const selectDay = (date: Date | null) => {
  if (date) {
    selectedDate.value = date;
  }
};
</script>

<template>
  <div class="w-full bg-white rounded-xl shadow-md p-6">
      <!-- カレンダーヘッダー -->
      <div class="flex justify-between items-center mb-6">
        <button @click="changeMonth(-1)" class="p-3 rounded-full hover:bg-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 class="text-3xl font-semibold text-gray-800">{{ formattedMonthYear }}</h3>
        <button @click="changeMonth(1)" class="p-3 rounded-full hover:bg-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- 曜日表示 -->
      <div class="grid grid-cols-7 text-center text-xl font-medium mb-4">
        <div 
          v-for="day in weekdays" 
          :key="day" 
          class="py-4"
          :class="{
            'text-red-500': day === '日', // 日曜日を赤色に
            'text-blue-500': day === '土', // 土曜日を青色に
            'text-gray-500': day !== '日' && day !== '土' // その他の曜日
          }"
        >
          {{ day }}
        </div>
      </div>

      <!-- 日付表示 -->
      <div class="grid grid-cols-7 gap-3 h-auto">
        <div
          v-for="(date, index) in calendarDays"
          :key="index"
          class="relative flex items-center justify-center p-3 rounded-full cursor-pointer transition-colors text-xl"
          :class="{
            'text-gray-400': !date, // 空のセル
            'text-gray-800 hover:bg-blue-100': date && !isSelected(date) && !isToday(date), // 通常の日付
            'bg-blue-500 text-white': isSelected(date), // 選択された日付
            'bg-blue-100 text-blue-800': isToday(date) && !isSelected(date), // 今日だが選択されていない日付
          }"
          @click="selectDay(date)"
        >
          {{ date ? date.getDate() : '' }}
          <span v-if="hasTodo(date)" class="absolute bottom-1 right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
        </div>
      </div>
    </div>
</template>

<style scoped>
/* カスタムカレンダーのセルの縦横比固定 (現在はパディングで制御しているため、このスタイルは不要ですが残しておきます) */
/* .aspect-square {
  aspect-ratio: 1 / 1;
} */
</style>
