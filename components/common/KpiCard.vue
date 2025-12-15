<template>
  <div class="bg-white p-6 rounded-lg shadow border-l-4" :class="borderColor">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500 uppercase">{{ title }}</p>
        <p class="mt-1 text-2xl font-semibold text-gray-900">
          {{ isCurrency ? 'S/. ' : '' }}{{ value }}
        </p>
      </div>
      <div class="p-3 rounded-full bg-opacity-10" :class="iconBgColor">
        <Icon :name="icon" class="w-8 h-8" :class="iconColor" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  value: number | string;
  icon: string;
  color: string;
  isCurrency?: boolean;
}>();

const borderColor = computed(() => `border-${props.color}-500`);
const iconBgColor = computed(() => `bg-${props.color}-500`);
const iconColor = computed(() => `text-${props.color}-600`);
</script>