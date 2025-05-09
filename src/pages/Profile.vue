<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white">Profile Settings</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Manage your personal information and preferences</p>
      </div>

      <!-- Profile Summary Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Profile Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center gap-3">
            <i class="pi pi-user text-primary-600 dark:text-primary-400 text-xl"></i>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p class="font-medium">{{ userInput.name || 'Not set' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <i class="pi pi-calendar text-primary-600 dark:text-primary-400 text-xl"></i>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Age</p>
              <p class="font-medium">{{ userInput.age || 'Not set' }} years</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <i class="pi pi-chart-line text-primary-600 dark:text-primary-400 text-xl"></i>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Height</p>
              <p class="font-medium">{{ userInput.height || 'Not set' }} cm</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <i class="pi pi-chart-bar text-primary-600 dark:text-primary-400 text-xl"></i>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Weight</p>
              <p class="font-medium">{{ userInput.weight || 'Not set' }} kg</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <form @submit.prevent="handleUpdateProfile" class="space-y-6">
          <!-- Personal Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label for="name" class="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <InputText 
                  id="name" 
                  v-model="userInput.name" 
                  class="w-full"
                  :class="{ 'p-invalid': v$.name.$invalid && v$.name.$dirty }"
                />
                <small v-if="v$.name.$invalid && v$.name.$dirty" class="text-red-500">
                  Name is required
                </small>
              </div>
              <div class="flex flex-col gap-2">
                <label for="age" class="text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                <InputNumber 
                  id="age" 
                  v-model="userInput.age" 
                  class="w-full"
                  :min="1"
                  :max="120"
                  :class="{ 'p-invalid': v$.age.$invalid && v$.age.$dirty }"
                />
                <small v-if="v$.age.$invalid && v$.age.$dirty" class="text-red-500">
                  Age must be between 1 and 120
                </small>
              </div>
            </div>
          </div>

          <!-- Physical Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Physical Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label for="height" class="text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
                <InputNumber 
                  id="height" 
                  v-model="userInput.height" 
                  class="w-full"
                  :min="50"
                  :max="250"
                  :class="{ 'p-invalid': v$.height.$invalid && v$.height.$dirty }"
                />
                <small v-if="v$.height.$invalid && v$.height.$dirty" class="text-red-500">
                  Height must be between 50 and 250 cm
                </small>
              </div>
              <div class="flex flex-col gap-2">
                <label for="weight" class="text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
                <InputNumber 
                  id="weight" 
                  v-model="userInput.weight" 
                  class="w-full"
                  :min="20"
                  :max="300"
                  :class="{ 'p-invalid': v$.weight.$invalid && v$.weight.$dirty }"
                />
                <small v-if="v$.weight.$invalid && v$.weight.$dirty" class="text-red-500">
                  Weight must be between 20 and 300 kg
                </small>
              </div>
            </div>
          </div>

          <!-- Preferences -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex flex-col gap-2">
                <label for="gender" class="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                <Dropdown
                  id="gender"
                  v-model="userInput.gender"
                  :options="genderOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Gender"
                  class="w-full"
                  :class="{ 'p-invalid': v$.gender.$invalid && v$.gender.$dirty }"
                />
                <small v-if="v$.gender.$invalid && v$.gender.$dirty" class="text-red-500">
                  Please select your gender
                </small>
              </div>
              <div class="flex flex-col gap-2">
                <label for="workStatus" class="text-sm font-medium text-gray-700 dark:text-gray-300">Activity Level</label>
                <Dropdown
                  id="workStatus"
                  v-model="userInput.workStatus"
                  :options="workStatusOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Activity Level"
                  class="w-full"
                  :class="{ 'p-invalid': v$.workStatus.$invalid && v$.workStatus.$dirty }"
                />
                <small v-if="v$.workStatus.$invalid && v$.workStatus.$dirty" class="text-red-500">
                  Please select your activity level
                </small>
              </div>
              <div class="flex flex-col gap-2">
                <label for="goal" class="text-sm font-medium text-gray-700 dark:text-gray-300">Goal</label>
                <Dropdown
                  id="goal"
                  v-model="userInput.goal"
                  :options="goalOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Goal"
                  class="w-full"
                  :class="{ 'p-invalid': v$.goal.$invalid && v$.goal.$dirty }"
                />
                <small v-if="v$.goal.$invalid && v$.goal.$dirty" class="text-red-500">
                  Please select your goal
                </small>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <Button 
              type="submit" 
              label="Update Profile"
              severity="success"
              :loading="isSubmitting"
              :disabled="v$.$invalid"
            >
              <template #icon>
                <i class="pi pi-check"></i>
              </template>
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast for success message -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useProfileStore } from "../stores/profileStore";
import { InputText, InputNumber, Button, Dropdown, Toast, useToast } from "primevue";
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, maxValue } from '@vuelidate/validators';

const profileStore = useProfileStore();
const isSubmitting = ref(false);
const toast = useToast();

const userInput = reactive({
  name: profileStore.name,
  age: profileStore.age,
  height: profileStore.height,
  weight: profileStore.weight,
  gender: profileStore.gender,
  workStatus: profileStore.workStatus,
  goal: profileStore.goal
});

const rules = {
  name: { required },
  age: { required, minValue: minValue(1), maxValue: maxValue(120) },
  height: { required, minValue: minValue(50), maxValue: maxValue(250) },
  weight: { required, minValue: minValue(20), maxValue: maxValue(300) },
  gender: { required },
  workStatus: { required },
  goal: { required }
};

const v$ = useVuelidate(rules, userInput);

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

const handleUpdateProfile = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  isSubmitting.value = true;
  try {
    profileStore.setAge(userInput.age!);
    profileStore.setHeight(userInput.height!);
    profileStore.setWeight(userInput.weight!);
    profileStore.setName(userInput.name!);
    profileStore.setGender(userInput.gender);
    profileStore.setWorkStatus(userInput.workStatus);
    profileStore.setGoal(userInput.goal);
    
    // Show success message using Toast
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile updated successfully',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update profile',
      life: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.p-invalid {
  border-color: var(--red-500) !important;
}

.p-invalid:focus {
  box-shadow: 0 0 0 2px var(--red-200) !important;
}
</style>
