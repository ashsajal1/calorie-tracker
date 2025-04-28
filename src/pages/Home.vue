<script setup lang="ts">
import { useCalorieStore } from '@/stores/calorieStore';

const calorieStore = useCalorieStore();

function add() {
  calorieStore.addCalories(500);
}

function burn() {
  calorieStore.burnCalories(200);
}

function reset() {
  calorieStore.resetCalories();
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl font-bold">Calories: {{ calorieStore.totalCalories }}</h1>
    <p>{{ calorieStore.calorieStatus }}</p>

    <div class="space-x-2 mt-4">
      <button @click="add" class="bg-green-500 px-4 py-2 text-white rounded">Add 500</button>
      <button @click="burn" class="bg-red-500 px-4 py-2 text-white rounded">Burn 200</button>
      <button @click="reset" class="bg-gray-500 px-4 py-2 text-white rounded">Reset</button>
    </div>
  </div>
</template>
