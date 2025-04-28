import { defineStore } from "pinia";
import { ref, watch } from "vue";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: string; // ISO string
}

export const useFoodHistoryStore = defineStore("foodHistory", () => {
  const history = ref<FoodEntry[]>([]);
  const todayCalories = ref(0);

  function addFood(name: string, calories: number) {
    const entry: FoodEntry = {
      id: crypto.randomUUID(),
      name,
      calories,
      timestamp: new Date().toISOString(),
    };
    history.value = [entry, ...history.value]; // new array
  }

  function clearHistory() {
    history.value = [];
  }

  function removeFood(id: string) {
    history.value = history.value.filter((entry) => entry.id !== id);
  }

  const STORAGE_KEY = "food-history";

  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        history.value = JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse food history from storage", error);
      }
    }
  }

  // --- Update todayCalories whenever history changes ---
  watch(
    history,
    (newHistory) => {
      const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
      todayCalories.value = newHistory
        .filter((entry) => entry.timestamp?.slice(0, 10) === today)
        .reduce((sum, entry) => sum + (entry.calories || 0), 0);

      // Also persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    },
    { deep: true, immediate: true } // run once at start
  );

  loadFromStorage(); // load saved data

  return {
    history,
    todayCalories,
    addFood,
    clearHistory,
    removeFood,
  };
});
