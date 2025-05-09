<template>
  <nav class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Brand -->
        <RouterLink 
          to="/" 
          class="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <i class="pi pi-chart-line text-primary-600 dark:text-primary-400"></i>
          <span>Calorie Tracker</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-4">
          <RouterLink 
            to="/" 
            class="nav-link"
            active-class="text-primary-600 dark:text-primary-400"
          >
            <i class="pi pi-home mr-2"></i>
            Home
          </RouterLink>
          <RouterLink 
            to="/profile" 
            class="nav-link"
            active-class="text-primary-600 dark:text-primary-400"
          >
            <i class="pi pi-user mr-2"></i>
            Profile
          </RouterLink>
          <RouterLink 
            to="/about" 
            class="nav-link"
            active-class="text-primary-600 dark:text-primary-400"
          >
            <i class="pi pi-info-circle mr-2"></i>
            About
          </RouterLink>
          <Button 
            :icon="themeIcon" 
            rounded 
            severity="secondary" 
            @click="next()"
            class="ml-2"
            v-tooltip.bottom="'Toggle Theme'"
          />
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex md:hidden items-center gap-2">
          <Button 
            :icon="themeIcon" 
            rounded 
            severity="secondary" 
            @click="next()"
            v-tooltip.bottom="'Toggle Theme'"
          />
          <Button 
            icon="pi pi-bars" 
            rounded
            severity="secondary"
            @click="toggleDrawer"
            v-tooltip.bottom="'Menu'"
          />
        </div>
      </div>
    </div>
  </nav>

  <!-- Mobile Drawer -->
  <Drawer 
    v-model:visible="isDrawerOpen" 
    position="right"
    :modal="true"
    :showCloseIcon="true"
    class="w-64"
  >
    <template #header>
      <div class="flex items-center gap-2 p-4 border-b dark:border-gray-700">
        <i class="pi pi-chart-line text-primary-600 dark:text-primary-400 text-xl"></i>
        <span class="font-bold text-lg">Menu</span>
      </div>
    </template>

    <div class="flex flex-col gap-1 p-2">
      <RouterLink 
        to="/" 
        class="nav-link-mobile"
        active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
        @click="isDrawerOpen = false"
      >
        <i class="pi pi-home"></i>
        <span>Home</span>
      </RouterLink>

      <RouterLink 
        to="/profile" 
        class="nav-link-mobile"
        active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
        @click="isDrawerOpen = false"
      >
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </RouterLink>

      <RouterLink 
        to="/about" 
        class="nav-link-mobile"
        active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
        @click="isDrawerOpen = false"
      >
        <i class="pi pi-info-circle"></i>
        <span>About</span>
      </RouterLink>
    </div>

    <template #footer>
      <div class="p-4 border-t dark:border-gray-700">
        <RouterLink 
          to="/settings" 
          class="nav-link-mobile"
          active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
          @click="isDrawerOpen = false"
        >
          <i class="pi pi-cog"></i>
          <span>Settings</span>
        </RouterLink>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { useColorMode, useCycleList } from "@vueuse/core";
import { Button, Drawer } from "primevue";
import { watchEffect, computed, ref } from "vue";

const mode = useColorMode({
  emitAuto: true,
  modes: {
    contrast: "dark contrast",
    cafe: "cafe",
  },
});

const { state, next } = useCycleList(["dark", "light"] as const, {
  initialValue: mode,
});

const isDrawerOpen = ref(false);
const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

watchEffect(() => (mode.value = state.value));
const themeIcon = computed(() =>
  state.value === "dark" ? "pi pi-sun" : "pi pi-moon"
);
</script>

<style scoped>
.nav-link {
  @apply flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg;
}

.nav-link-mobile {
  @apply flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg;
}

.nav-link-mobile i {
  @apply text-lg;
}
</style>
