<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-extrabold">Profile</h1>
    <form
      class="flex flex-col gap-4 mt-8"
      @submit.prevent="handleUpdateProfile"
    >
      <div class="flex flex-col gap-2">
        <label for="name">Name</label>
        <InputText id="name" v-model="userInput.name" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="age">Age</label>
        <InputNumber id="age" v-model="userInput.age" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="height">Height (cm)</label>
        <InputNumber id="height" v-model="userInput.height" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="weight">Weight (kg)</label>
        <InputNumber id="weight" v-model="userInput.weight" />
      </div>
      <Button type="submit">Update Profile</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useProfileStore } from "../stores/profileStore";
import { InputText, InputNumber, Button } from "primevue";

const profileStore = useProfileStore();

const userInput = reactive({
  name: profileStore.name,
  age: profileStore.age,
  height: profileStore.height,
  weight: profileStore.weight,
});

const handleUpdateProfile = () => {
  profileStore.setAge(userInput.age!);
  profileStore.setHeight(userInput.height!);
  profileStore.setWeight(userInput.weight!);
  profileStore.setName(userInput.name!);
  alert("Profile updated successfully!");
};
</script>
