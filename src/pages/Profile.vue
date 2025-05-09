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
      <div class="flex flex-col gap-2">
        <label for="gender">Gender</label>
        <Dropdown
          id="gender"
          v-model="userInput.gender"
          :options="genderOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Gender"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="workStatus">Activity Level</label>
        <Dropdown
          id="workStatus"
          v-model="userInput.workStatus"
          :options="workStatusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Activity Level"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="goal">Goal</label>
        <Dropdown
          id="goal"
          v-model="userInput.goal"
          :options="goalOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Goal"
        />
      </div>
      <Button type="submit">Update Profile</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useProfileStore } from "../stores/profileStore";
import { InputText, InputNumber, Button, Dropdown } from "primevue";

const profileStore = useProfileStore();

const userInput = reactive({
  name: profileStore.name,
  age: profileStore.age,
  height: profileStore.height,
  weight: profileStore.weight,
  gender: profileStore.gender,
  workStatus: profileStore.workStatus,
  goal: profileStore.goal
});

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" }
];

const workStatusOptions = [
  { label: "Sedentary", value: "sedentary" },
  { label: "Moderate", value: "moderate" },
  { label: "Active", value: "active" },
  { label: "Very Active", value: "very_active" }
];

const goalOptions = [
  { label: "Maintain Weight", value: "maintain" },
  { label: "Weight Loss", value: "weight_loss" },
  { label: "Weight Gain", value: "weight_gain" }
];

const handleUpdateProfile = () => {
  profileStore.setAge(userInput.age!);
  profileStore.setHeight(userInput.height!);
  profileStore.setWeight(userInput.weight!);
  profileStore.setName(userInput.name!);
  profileStore.setGender(userInput.gender);
  profileStore.setWorkStatus(userInput.workStatus);
  profileStore.setGoal(userInput.goal);
  alert("Profile updated successfully!");
};
</script>
