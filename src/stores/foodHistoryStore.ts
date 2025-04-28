import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

interface FoodEntry {
  name: string;
  calories: number;
  timestamp: string; // ISO string
}

export const useFoodHistoryStore = defineStore('foodHistory', () => {
  const history = ref<FoodEntry[]>([]);

  function addFood(name: string, calories: number) {
    const entry: FoodEntry = {
      name,
      calories,
      timestamp: new Date().toISOString(),
    };
    history.value.unshift(entry); // add to the beginning
  }

  function clearHistory() {
    history.value = [];
  }

  // --- LocalStorage persistency ---
  const STORAGE_KEY = 'food-history';

  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        history.value = JSON.parse(saved);
      } catch (error) {
        console.error('Failed to parse food history from storage', error);
      }
    }
  }

  watch(history, (newHistory) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  }, { deep: true });

  // load once when store is used
  loadFromStorage();

  return {
    history,
    addFood,
    clearHistory,
  };
});
