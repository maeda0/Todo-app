<script setup lang="ts">
import { ref, computed, watch, defineEmits } from 'vue'; // watch と defineEmits をインポート
import 'v-calendar/style.css'; // v-calendarのCSSをインポート

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const props = defineProps<{
  todos: Record<string, Todo[]>;
}>();

const emit = defineEmits(['update:selectedDate']);

const selectedDate = ref(new Date());

// selectedDateが変更されたら親コンポーネントに通知
watch(selectedDate, (newDate) => {
  emit('update:selectedDate', newDate);
});

// カレンダーに表示するドットとハイライトの属性を計算
const attrs = computed(() => [
  {
    key: 'today',
    // 当日を薄い青色でハイライト
    highlight: {
      color: 'blue',
      fillMode: 'light', // 薄い青色
    },
    dates: new Date(),
  },
  {
    key: 'selected', // 選択された日付のハイライト
    // 選択箇所を濃い青色でハイライト
    highlight: {
      color: 'blue',
      fillMode: 'solid', // 濃い青色
    },
    dates: selectedDate.value, // 現在選択されている日付
  },
  {
    key: 'todos',
    dot: 'blue', // Todoがある日付に青いドット
    dates: Object.keys(props.todos).filter(dateKey => props.todos[dateKey].length > 0).map(dateKey => new Date(dateKey)),
  },
]);
</script>

<template>
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
</template>
