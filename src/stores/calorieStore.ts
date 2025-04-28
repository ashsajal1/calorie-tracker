import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

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

  // --- LocalStorage persistency ---
  const STORAGE_KEY = "calorie-total";

  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        totalCalories.value = JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse calorie total from storage", error);
      }
    }
  }

  watch(totalCalories, (newCalories) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCalories));
  });

  // Load once when store is used
  loadFromStorage();

  return {
    totalCalories,
    addCalories,
    burnCalories,
    resetCalories,
    calorieStatus,
  };
});
