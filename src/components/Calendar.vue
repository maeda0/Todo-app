<script setup lang="ts">
import { ref } from 'vue';

const date = ref(new Date());
</script>

<template>
    <VDatePicker v-model="date" mode="dateTime" hide-time-header />
    

</template>