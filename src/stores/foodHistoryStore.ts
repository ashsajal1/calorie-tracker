import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: string; // ISO string
}

export const useFoodHistoryStore = defineStore("foodHistory", () => {
  const history = ref<FoodEntry[]>([]);

  function addFood(name: string, calories: number) {
    const entry: FoodEntry = {
      id: crypto.randomUUID(), // generate a unique ID
      name,
      calories,
      timestamp: new Date().toISOString(),
    };
    history.value.unshift(entry); // add to the beginning
  }

  function clearHistory() {
    history.value = [];
  }

  function removeFood(id: string) {
    const index = history.value.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      history.value.splice(index, 1);
    }
  }

  // --- LocalStorage persistency ---
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

  watch(
    history,
    (newHistory) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    },
    { deep: true }
  );

  // --- Calculate today's calories ---
  const todayCalories = computed(() => {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    return history.value
      .filter((entry) => entry?.timestamp?.slice(0, 10) === today)
      .reduce((sum, entry) => sum + (entry.calories || 0), 0);
  });

  // load once when store is used
  loadFromStorage();

  return {
    history,
    addFood,
    clearHistory,
    todayCalories,
    removeFood,
  };
});
