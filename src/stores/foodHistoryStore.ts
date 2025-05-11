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

  const STORAGE_KEY = "food-history";

  function addFood(name: string, calories: number) {
    const entry: FoodEntry = {
      id: crypto.randomUUID(),
      name,
      calories,
      timestamp: new Date().toISOString(),
    };
    history.value = [entry, ...history.value];
  }

  function clearHistory() {
    history.value = [];
  }

  function removeFood(id: string) {
    history.value = history.value.filter((entry) => entry.id !== id);
  }

  function editFood(id: string, name: string, calories: number) {
    const entryIndex = history.value.findIndex((entry) => entry.id === id);
    if (entryIndex !== -1) {
      history.value = [
        ...history.value.slice(0, entryIndex),
        { ...history.value[entryIndex], name, calories },
        ...history.value.slice(entryIndex + 1)
      ];
    }
  }

  function calculateTodayCalories() {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    todayCalories.value = history.value
      .filter((entry) => entry.timestamp?.slice(0, 10) === today)
      .reduce((sum, entry) => sum + (entry.calories || 0), 0);
  }

  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          history.value = parsed;
        } else {
          console.warn("Invalid data in localStorage, resetting history.");
          history.value = [];
        }
      } catch (error) {
        console.error("Failed to parse food history from storage", error);
        history.value = [];
      }
    }
    calculateTodayCalories(); // <<< recalculate after loading
  }

  watch(
    history,
    (newHistory) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      calculateTodayCalories(); // <<< recalculate after any change
    },
    { deep: true }
  );

  loadFromStorage();

  return {
    history,
    todayCalories,
    addFood,
    clearHistory,
    removeFood,
    editFood,
  };
});
