import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useProfileStore = defineStore("profile", () => {
  const name = ref<string | null>(null);
  const age = ref<number | null>(null);
  const weight = ref<number | null>(null); // in kilograms
  const height = ref<number | null>(null); // in centimeters

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

  return {
    name,
    age,
    weight,
    height,
    setName,
    setAge,
    setWeight,
    setHeight,
    resetProfile,
    bmi,
  };
});
