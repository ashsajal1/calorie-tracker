<script setup lang="ts">
import { useCalorieStore } from "@/stores/calorieStore";
import { Button, Dialog, InputText, InputNumber } from "primevue";
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
    profileStore.age!
  );
  return calorie;
});
</script>

<template>
  <main class="flex sm:flex-row flex-col gap-4 p-4 md:justify-between">
    <div class="p-4 grid place-items-center">
      <WaveProgress
        :current="foodHistoryStore.todayCalories"
        :target="requiredCalories"
      />
    </div>

    <Dialog
      v-model:visible="visible"
      :header="`Add Food`"
      :modal="true"
      :draggable="false"
      :resizable="false"
    >
      <div>
        <div class="flex flex-col gap-2">
          <InputText v-model="foodName" placeholder="Food Name" />
          <InputNumber v-model="calories" placeholder="Calories" />
          <Button
            class="w-full"
            @click="handleAddFood"
            icon="pi pi-plus"
            severity="success"
          />
        </div>
      </div>
    </Dialog>

    <!-- Edit dialog -->
    <Dialog
      v-model:visible="visibleEdit"
      :header="`Edit Food`"
      :modal="true"
      :draggable="false"
      :resizable="false"
    >
      <div></div>
      <div class="flex flex-col gap-2">
        <InputText v-model="selectedFood.name" placeholder="Food Name" />
        <InputNumber v-model="selectedFood.calories" placeholder="Calories" />
        <Button
          class="w-full"
          @click="
            foodHistoryStore.editFood(
              selectedFood!.id,
              selectedFood!.name,
              selectedFood!.calories
            );
            visibleEdit = false;
          "
          icon="pi pi-plus"
          severity="success"
        />
      </div>
    </Dialog>

    <section class="flex flex-col w-full md:w-1/2">
      <div class="p-3 flex justify-between items-center">
        <h2 class="text-2xl font-bold mt-8">Eating History</h2>
        <Button
          @click="visible = true"
          icon="pi pi-plus"
          severity="secondary"
          class="mt-4"
        />
      </div>

      <div class="flex flex-col gap-4">
        <div
          v-for="[date, data] in groupedHistory"
          :key="date"
          class="border rounded-lg overflow-hidden dark:border-gray-700 mb-4"
        >
          <div class="bg-gray-50 dark:bg-gray-800 p-3">
            <h3 class="font-semibold">{{ date }}</h3>
            <p class="text-sm text-gray-500">
              Total: {{ data.totalCalories }} calories
            </p>
          </div>

          <div
            v-for="food in data.foods"
            :key="food.id"
            class="flex flex-row w-full items-center gap-2 justify-between p-3 border-t dark:border-gray-700"
          >
            <div class="flex flex-col gap-2">
              <p class="text-lg font-bold">{{ food.name }}</p>
              <p class="text-sm text-gray-500 flex gap-2">
                <span>{{ food.calories }} calories</span>
                -
                <span>{{ formatTime(food.timestamp.toString()) }}</span>
              </p>
            </div>
            <div class="flex flex-row gap-2">
              <Button
                @click="foodHistoryStore.removeFood(food.id)"
                size="small"
                icon="pi pi-trash"
                severity="danger"
              />
              <Button
                @click="
                  visibleEdit = true;
                  selectedFood = {
                    id: food.id,
                    name: food.name,
                    calories: food.calories,
                  };
                "
                :disabled="foodHistoryStore.history.length === 0"
                size="small"
                icon="pi pi-pen-to-square"
                severity="secondary"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
