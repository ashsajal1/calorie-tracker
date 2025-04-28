<script setup lang="ts">
import { useCalorieStore } from "@/stores/calorieStore";
import { Card, Button, Dialog, InputText, InputNumber } from "primevue";
import { ref } from "vue";
import { useFoodHistoryStore } from "../stores/foodHistoryStore";
import { formatTime } from "../utils/lib";

const calorieStore = useCalorieStore();
const foodHistoryStore = useFoodHistoryStore();
// const { history, todayCalories, addFood, removeFood } = foodHistoryStore;
const visible = ref(false);
const foodName = ref("");
const calories = ref(0);

const handleAddFood = () => {
  if (foodName.value && calories.value) {
    calorieStore.addCalories(calories.value);
    foodHistoryStore.addFood(foodName.value, calories.value);
    foodName.value = "";
    calories.value = 0;

    visible.value = false;
  }
};
</script>

<template>
  <div class="p-4 grid place-items-center">
    <h1
      class="text-xl font-bold h-40 w-40 rounded-full p-6 bg-green-500 text-center grid place-items-center"
    >
      Calories: {{ foodHistoryStore.todayCalories }}
    </h1>
    <p>{{ calorieStore.calorieStatus }}</p>
  </div>

  <div class="p-3 flex justify-between items-center">
    <h2 class="text-2xl font-bold mt-8">Eating History</h2>
    <Button
      @click="visible = true"
      icon="pi pi-plus"
      severity="secondary"
      class="mt-4"
    />
  </div>

  <Dialog
    v-model:visible="visible"
    :header="`Add Food`"
    :modal="true"
    :draggable="false"
    :resizable="false"
  >
    <div>
      <div class="flex flex-col gap-2">
        <InputText v-model="foodName" placeholder="Food Name" />
        <InputNumber v-model="calories" placeholder="Calories" />
        <Button
          class="w-full"
          @click="handleAddFood"
          icon="pi pi-plus"
          severity="success"
        />
      </div>
    </div>
  </Dialog>

  <div>
    <div
      class="flex flex-row w-full items-center gap-2 justify-between p-3 border-b dark:border-b-gray-700"
      v-for="food in foodHistoryStore.history"
      :key="food.id"
    >
      <div class="flex flex-col gap-2 pb-2">
        <p class="text-lg font-bold">{{ food.name }}</p>
        <p class="text-sm text-gray-500 flex gap-2">
          <span>{{ food.calories }} calories</span>
          -
          <span>{{ formatTime(food.timestamp) }}</span>
        </p>
      </div>
      <div class="flex flex-row gap-2">
        <Button
          @click="foodHistoryStore.removeFood(food.id)"
          size="small"
          icon="pi pi-trash"
          severity="danger"
        ></Button>
        <Button
          size="small"
          icon="pi pi-pen-to-square"
          severity="secondary"
        ></Button>
      </div>
    </div>
  </div>
</template>
