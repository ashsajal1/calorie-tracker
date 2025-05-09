<script setup lang="ts">
import { useCalorieStore } from "@/stores/calorieStore";
import { Button, Dialog, InputText, InputNumber, Calendar } from "primevue";
import { reactive, ref, computed } from "vue";
import { useFoodHistoryStore } from "../stores/foodHistoryStore";
import { calculateRequiredCalories, formatTime } from "../utils/lib";
import WaveProgress from "@/components/WaveProgress.vue";
import { useProfileStore } from "@/stores/profileStore";

interface FoodGroup {
  foods: Array<{
    id: string;
    name: string;
    calories: number;
    timestamp: string;
  }>;
  totalCalories: number;
}

interface GroupedHistory {
  [date: string]: FoodGroup;
}

const calorieStore = useCalorieStore();
const foodHistoryStore = useFoodHistoryStore();
const visible = ref(false);
const visibleEdit = ref(false);
const searchQuery = ref("");
const dateRange = ref<[Date | null, Date | null]>([null, null]);

const foodName = ref("");
const calories = ref(0);

const selectedFood = reactive({
  id: "",
  name: "",
  calories: 0,
});

const groupedHistory = computed(() => {
  const groups = foodHistoryStore.history.reduce(
    (acc: GroupedHistory, food) => {
      const date = new Date(food.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!acc[date]) {
        acc[date] = {
          foods: [],
          totalCalories: 0,
        };
      }

      acc[date].foods.push(food);
      acc[date].totalCalories += food.calories;
      return acc;
    },
    {}
  );

  return Object.entries(groups).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );
});

// Filtered history based on search and date range
const filteredHistory = computed(() => {
  let filtered = groupedHistory.value;

  // Apply search filter
  if (searchQuery.value) {
    filtered = filtered.map(([date, data]) => [
      date,
      {
        ...data,
        foods: data.foods.filter((food) =>
          food.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        ),
      },
    ] as [string, FoodGroup]).filter(([_, data]) => data.foods.length > 0);
  }

  // Apply date range filter
  if (dateRange.value[0] && dateRange.value[1]) {
    const startDate = dateRange.value[0];
    const endDate = dateRange.value[1];
    filtered = filtered.filter(([date]) => {
      const currentDate = new Date(date);
      return currentDate >= startDate && currentDate <= endDate;
    });
  }

  return filtered;
});

// Weekly statistics
const weeklyStats = computed(() => {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);

  const weekData = foodHistoryStore.history.filter(
    (food) => new Date(food.timestamp) >= weekStart
  );

  const totalCalories = weekData.reduce((sum, food) => sum + food.calories, 0);
  const avgCalories = Math.round(totalCalories / 7);

  return {
    total: totalCalories,
    average: avgCalories,
    entries: weekData.length,
  };
});

const handleAddFood = () => {
  if (foodName.value && calories.value) {
    calorieStore.addCalories(calories.value);
    foodHistoryStore.addFood(foodName.value, calories.value);
    foodName.value = "";
    calories.value = 0;

    visible.value = false;
  }
};

const profileStore = useProfileStore();
const requiredCalories = computed(() => {
  const calorie = calculateRequiredCalories(
    profileStore.weight!,
    profileStore.height!,
    profileStore.age!,
    profileStore.goal!,
    profileStore.gender!,
    profileStore.workStatus!
  );
  return calorie;
});
</script>

<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Summary Section -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Calorie Progress -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <h2 class="text-xl font-semibold mb-4">Today's Progress</h2>
          <div class="flex justify-center">
            <WaveProgress
              :current="foodHistoryStore.todayCalories"
              :target="requiredCalories"
            />
          </div>
          <div class="mt-4 text-center">
            <p class="text-gray-600 dark:text-gray-300">
              {{ foodHistoryStore.todayCalories }} / {{ requiredCalories }} calories
            </p>
          </div>
        </div>

        <!-- Weekly Stats -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <h2 class="text-xl font-semibold mb-4">Weekly Overview</h2>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {{ weeklyStats.total }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">Average</p>
              <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {{ weeklyStats.average }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">Entries</p>
              <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {{ weeklyStats.entries }}
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Add Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <h2 class="text-xl font-semibold mb-4">Quick Add Food</h2>
          <div class="flex flex-col gap-4">
            <InputText 
              v-model="foodName" 
              placeholder="Food Name" 
              class="w-full"
            />
            <InputNumber 
              v-model="calories" 
              placeholder="Calories" 
              class="w-full"
            />
            <Button
              @click="handleAddFood"
              icon="pi pi-plus"
              severity="success"
              class="w-full"
              :disabled="!foodName || !calories"
            >
              Add Food
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Food History Section -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 class="text-2xl font-bold">Eating History</h2>
          <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <InputText
              v-model="searchQuery"
              placeholder="Search foods..."
              class="w-full sm:w-64"
            />
            <Calendar
              v-model="dateRange"
              selectionMode="range"
              :showIcon="true"
              placeholder="Select date range"
              class="w-full sm:w-64"
            />
            <Button
              @click="visible = true"
              icon="pi pi-plus"
              severity="primary"
              label="Add Food"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredHistory.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div class="text-gray-400 dark:text-gray-600 mb-4">
          <i class="pi pi-history text-6xl"></i>
        </div>
        <h3 class="text-xl font-semibold mb-2">No Food History Found</h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ searchQuery ? 'No foods match your search' : 'Start tracking your meals by adding your first food entry' }}
        </p>
      </div>

      <!-- Food History List -->
      <div v-else class="flex flex-col gap-6">
        <div
          v-for="[date, data] in filteredHistory"
          :key="date"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
        >
          <div class="bg-gray-50 dark:bg-gray-700 p-4">
            <div class="flex justify-between items-center">
              <h3 class="font-semibold text-lg">{{ date }}</h3>
              <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                {{ data.totalCalories }} calories
              </span>
            </div>
          </div>

          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div
              v-for="food in data.foods"
              :key="food.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">{{ food.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
                    <span>{{ food.calories }} calories</span>
                    <span>•</span>
                    <span>{{ formatTime(food.timestamp.toString()) }}</span>
                  </p>
                </div>
                <div class="flex gap-2">
                  <Button
                    @click="
                      visibleEdit = true;
                      selectedFood = {
                        id: food.id,
                        name: food.name,
                        calories: food.calories,
                      };
                    "
                    icon="pi pi-pencil"
                    severity="secondary"
                    text
                    rounded
                  />
                  <Button
                    @click="foodHistoryStore.removeFood(food.id)"
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    rounded
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Food Dialog -->
    <Dialog
      v-model:visible="visible"
      header="Add New Food"
      :modal="true"
      :draggable="false"
      :resizable="false"
      class="w-full max-w-md"
    >
      <div class="flex flex-col gap-4 p-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Food Name</label>
          <InputText 
            v-model="foodName" 
            placeholder="Enter food name"
            class="w-full"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Calories</label>
          <InputNumber 
            v-model="calories" 
            placeholder="Enter calories"
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            @click="visible = false"
            label="Cancel"
            severity="secondary"
            text
          />
          <Button
            @click="handleAddFood"
            label="Add Food"
            icon="pi pi-plus"
            severity="success"
            :disabled="!foodName || !calories"
          />
        </div>
      </template>
    </Dialog>

    <!-- Edit Food Dialog -->
    <Dialog
      v-model:visible="visibleEdit"
      header="Edit Food"
      :modal="true"
      :draggable="false"
      :resizable="false"
      class="w-full max-w-md"
    >
      <div class="flex flex-col gap-4 p-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Food Name</label>
          <InputText 
            v-model="selectedFood.name" 
            placeholder="Enter food name"
            class="w-full"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Calories</label>
          <InputNumber 
            v-model="selectedFood.calories" 
            placeholder="Enter calories"
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            @click="visibleEdit = false"
            label="Cancel"
            severity="secondary"
            text
          />
          <Button
            @click="
              foodHistoryStore.editFood(
                selectedFood.id,
                selectedFood.name,
                selectedFood.calories
              );
              visibleEdit = false;
            "
            label="Save Changes"
            icon="pi pi-check"
            severity="success"
            :disabled="!selectedFood.name || !selectedFood.calories"
          />
        </div>
      </template>
    </Dialog>
  </main>
</template>

<style scoped>
.transition-all {
  transition: all 0.2s ease-in-out;
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
