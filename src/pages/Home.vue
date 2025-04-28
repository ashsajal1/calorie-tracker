<script setup lang="ts">
import { useCalorieStore } from "@/stores/calorieStore";
import { Card, Button } from "primevue";

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
  <div class="p-4 grid place-items-center">
    <h1
      class="text-xl font-bold h-40 w-40 rounded-full p-6 bg-green-500 text-center grid place-items-center"
    >
      Calories: {{ calorieStore.totalCalories }}
    </h1>
    <p>{{ calorieStore.calorieStatus }}</p>

    <div class="space-x-2 mt-4">
      <button @click="add" class="bg-green-500 px-4 py-2 text-white rounded">
        Add 500
      </button>
      <button @click="burn" class="bg-red-500 px-4 py-2 text-white rounded">
        Burn 200
      </button>
      <button @click="reset" class="bg-gray-500 px-4 py-2 text-white rounded">
        Reset
      </button>
    </div>
  </div>
  
  <h2 class="text-2xl font-bold mt-8 p-3">Eating History</h2>

  <div>
    <div class="flex flex-row w-full items-center gap-2 justify-between p-3 border-b dark:border-b-gray-700">
      <div class="flex flex-col gap-2 pb-2">
        <p class="text-lg font-bold">Food Name</p>
        <p class="text-sm text-gray-500 flex gap-2">
          <span>Calories: 100</span>
          -
          <span>12 Dec, 2024</span>
        </p>
      </div>
      <div class="flex flex-row gap-2">
        <Button size="small" icon="pi pi-trash" severity="danger"></Button>
        <Button size="small" icon="pi pi-pen-to-square" severity="secondary"></Button>
      </div>
    </div>
  </div>
</template>
