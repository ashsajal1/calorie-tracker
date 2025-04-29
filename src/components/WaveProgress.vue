<template>
    <div class="relative w-[200px] h-[200px] rounded-full overflow-hidden shadow-[0_4px_15px_rgba(0,255,0,0.3)] bg-gradient-to-br from-green-500 to-green-700">
      <div class="absolute w-full h-full overflow-hidden bottom-0 transition-transform duration-300" :style="waveMaskStyle">
        <div class="absolute bottom-0 w-[200%] h-[200%] bg-white/20 rounded-[35%] animate-wave"></div>
      </div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
        <h2 class="text-lg font-semibold">Calories: {{ current }}</h2>
        <small class="text-sm">Goal: {{ target }}</small>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps } from 'vue';
  
  const props = defineProps({
    current: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      default: 1000,
    },
  });
  
  const waveMaskStyle = computed(() => {
    const percent = Math.min(props.current / props.target, 1);
    const translateY = 100 - percent * 100;
    return {
      transform: `translateY(${translateY}%)`,
    };
  });
  </script>
  
  <style>
  @keyframes wave {
    0% {
      transform: translateX(0) translateY(0);
    }
    100% {
      transform: translateX(-50%) translateY(0);
    }
  }
  .animate-wave {
    animation: wave 4s linear infinite;
  }
  </style>
  