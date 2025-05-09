<script setup lang="ts">
import { useCalorieStore } from "@/stores/calorieStore";
import { Button, Dialog, InputText, InputNumber, Calendar, Dropdown } from "primevue";
import Chart from 'primevue/chart';
import { reactive, ref, computed } from "vue";
import { useFoodHistoryStore } from "../stores/foodHistoryStore";
import { calculateRequiredCalories, formatTime, getFoodList, calculateFoodCalories, getFoodsByCategory } from "../utils/lib";
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

type FoodCategory = 'protein' | 'carbs' | 'fats' | 'vegetables' | 'fruits' | 'dairy' | 'snacks';

const calorieStore = useCalorieStore();
const foodHistoryStore = useFoodHistoryStore();
const visible = ref(false);
const visibleEdit = ref(false);
const searchQuery = ref("");
const dateRange = ref<[Date | null, Date | null]>([null, null]);

const foodName = ref("");
const calories = ref(0);
const selectedCategory = ref<FoodCategory | "">("");
const isCustomFood = ref(false);
const selectedFood = reactive({
  id: "",
  name: "",
  calories: 0,
  servingSize: 100,
});

// Get food list and categories
const foodList = getFoodList();
const categories = computed(() => {
  const uniqueCategories = new Set(foodList.map(food => food.category));
  return Array.from(uniqueCategories).map(category => ({
    label: category.charAt(0).toUpperCase() + category.slice(1),
    value: category
  }));
});

const filteredFoods = computed(() => {
  if (!selectedCategory.value) return [];
  return getFoodsByCategory(selectedCategory.value).map(food => ({
    label: `${food.name} (${food.calories} cal/100${food.servingUnit})`,
    value: food.id,
    food: food
  }));
});

const handleFoodSelect = (event: any) => {
  const selectedFoodData = foodList.find(f => f.id === event.value);
  if (selectedFoodData) {
    foodName.value = selectedFoodData.name;
    calories.value = calculateFoodCalories(selectedFoodData.id, selectedFood.servingSize);
  }
};

const handleServingSizeChange = (size: number) => {
  if (selectedFood.id) {
    calories.value = calculateFoodCalories(selectedFood.id, size);
  }
};

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

// Weekly statistics with chart data
const weeklyStats = computed(() => {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);

  // Create array of last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return date;
  }).reverse();

  // Get calories for each day
  const dailyCalories = days.map(date => {
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    return foodHistoryStore.history
      .filter(food => {
        const foodDate = new Date(food.timestamp);
        return foodDate >= dayStart && foodDate <= dayEnd;
      })
      .reduce((sum, food) => sum + food.calories, 0);
  });

  const totalCalories = dailyCalories.reduce((sum, calories) => sum + calories, 0);
  const avgCalories = Math.round(totalCalories / 7);

  // Chart data
  const chartData = {
    labels: days.map(date => date.toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'Daily Calories',
        data: dailyCalories,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4
      },
      {
        label: 'Target',
        data: Array(7).fill(requiredCalories.value),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4
      }
    ]
  };

  return {
    total: totalCalories,
    average: avgCalories,
    entries: foodHistoryStore.history.filter(food => new Date(food.timestamp) >= weekStart).length,
    chartData
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
          <div class="grid grid-cols-3 gap-4 mb-4">
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
          <div class="h-64">
            <Chart type="line" :data="weeklyStats.chartData" :options="{
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: 'var(--text-color)'
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'var(--surface-border)'
                  },
                  ticks: {
                    color: 'var(--text-color)'
                  }
                },
                x: {
                  grid: {
                    color: 'var(--surface-border)'
                  },
                  ticks: {
                    color: 'var(--text-color)'
                  }
                }
              },
              maintainAspectRatio: false
            }" />
          </div>
        </div>

        <!-- Quick Add Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <h2 class="text-xl font-semibold mb-4">Quick Add Food</h2>
          <div class="flex flex-col gap-4">
            <!-- Toggle between predefined and custom food -->
            <div class="flex items-center gap-4 mb-2">
              <Button
                :class="{ 'bg-primary-100 dark:bg-primary-900': !isCustomFood }"
                :severity="isCustomFood ? 'secondary' : 'primary'"
                @click="isCustomFood = false"
                class="flex-1"
              >
                <i class="pi pi-list mr-2"></i>
                Predefined Foods
              </Button>
              <Button
                :class="{ 'bg-primary-100 dark:bg-primary-900': isCustomFood }"
                :severity="isCustomFood ? 'primary' : 'secondary'"
                @click="isCustomFood = true"
                class="flex-1"
              >
                <i class="pi pi-plus mr-2"></i>
                Custom Food
              </Button>
            </div>

            <!-- Predefined Foods Section -->
            <div v-if="!isCustomFood" class="flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">Food Category</label>
                <Dropdown
                  v-model="selectedCategory"
                  :options="categories"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select a category"
                  class="w-full"
                />
              </div>
              
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">Select Food</label>
                <Dropdown
                  v-model="selectedFood.id"
                  :options="filteredFoods"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select a food"
                  class="w-full"
                  :disabled="!selectedCategory"
                  @change="handleFoodSelect"
                />
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">Serving Size</label>
                <div class="flex gap-2">
                  <InputNumber
                    v-model="selectedFood.servingSize"
                    placeholder="Serving size"
                    class="w-full"
                    :min="1"
                    @update:modelValue="handleServingSizeChange"
                  />
                  <span class="flex items-center text-gray-500">
                    {{ selectedFood.id ? foodList.find(f => f.id === selectedFood.id)?.servingUnit : 'g' }}
                  </span>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">Calories</label>
                <InputNumber
                  v-model="calories"
                  placeholder="Calories"
                  class="w-full"
                  :disabled="true"
                />
              </div>
            </div>

            <!-- Custom Food Section -->
            <div v-else class="flex flex-col gap-4">
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
                  :min="0"
                />
              </div>
            </div>

            <Button
              @click="handleAddFood"
              icon="pi pi-plus"
              severity="success"
              class="w-full"
              :disabled="isCustomFood ? (!foodName || !calories) : (!selectedFood.id || !calories)"
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
                        servingSize: 100
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

:deep(.p-chart) {
  width: 100%;
  height: 100%;
}

.bg-primary-100 {
  background-color: var(--primary-100);
}

.dark .bg-primary-900 {
  background-color: var(--primary-900);
}
</style>
