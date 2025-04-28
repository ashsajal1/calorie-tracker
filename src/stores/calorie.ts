import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCalorieStore = defineStore("calorie", () => {
  const totalCalories = ref(0);

  function addCalories(amount: number) {
    totalCalories.value += amount;
  }

  function burnCalories(amount: number) {
    totalCalories.value -= amount;
    if (totalCalories.value < 0) {
      totalCalories.value = 0;
    }
  }

  function resetCalories() {
    totalCalories.value = 0;
  }

  const calorieStatus = computed(() => {
    if (totalCalories.value === 0) return "No calories consumed yet!";
    if (totalCalories.value < 1500) return "You are doing great!";
    return "Watch your intake!";
  });

  return {
    totalCalories,
    addCalories,
    burnCalories,
    resetCalories,
    calorieStatus,
  };
});
