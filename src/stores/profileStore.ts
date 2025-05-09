import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export const useProfileStore = defineStore("profile", () => {
  const name = ref<string | null>(null);
  const age = ref<number | null>(null);
  const weight = ref<number | null>(null); // in kilograms
  const height = ref<number | null>(null); // in centimeters
  const workStatus = ref<"active" | "sedentary" | "moderate" | "very_active">(
    "active"
  );
  const gender = ref<"male" | "female">("male");
  const goal = ref<"weight_loss" | "weight_gain" | "maintain">("maintain");

  function setName(newName: string) {
    name.value = newName;
  }

  function setAge(newAge: number) {
    age.value = newAge;
  }

  function setWeight(newWeight: number) {
    weight.value = newWeight;
  }

  function setHeight(newHeight: number) {
    height.value = newHeight;
  }

  function setWorkStatus(
    newWorkStatus: "active" | "sedentary" | "moderate" | "very_active"
  ) {
    workStatus.value = newWorkStatus;
  }

  function setGender(newGender: "male" | "female") {
    gender.value = newGender;
  }

  function setGoal(newGoal: "weight_loss" | "weight_gain" | "maintain") {
    goal.value = newGoal;
  }

  function resetProfile() {
    name.value = null;
    age.value = null;
    weight.value = null;
    height.value = null;
  }

  const bmi = computed(() => {
    if (!weight.value || !height.value) return null;
    const heightInMeters = height.value / 100;
    return (weight.value / (heightInMeters * heightInMeters)).toFixed(2);
  });

  // --- LocalStorage persistency ---
  const STORAGE_KEY = "profile-data";

  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        name.value = data.name ?? null;
        age.value = data.age ?? null;
        weight.value = data.weight ?? null;
        height.value = data.height ?? null;
      } catch (error) {
        console.error("Failed to parse profile from storage", error);
      }
    }
  }

  watch(
    [name, age, weight, height],
    ([newName, newAge, newWeight, newHeight]) => {
      const data = {
        name: newName,
        age: newAge,
        weight: newWeight,
        height: newHeight,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    { deep: true }
  );

  loadFromStorage();

  return {
    name,
    age,
    weight,
    height,
    setName,
    setAge,
    setWeight,
    setHeight,
    setGender,
    setGoal,
    setWorkStatus,
    resetProfile,
    bmi,
  };
});
