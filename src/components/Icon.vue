<script setup>
import { computed } from 'vue';

//Config
import { icons } from '@/config/icons.js';

const props = defineProps({
  name: { type: String, required: true }
});

const path = computed(() => icons[props.name]);
</script>
<template>
  <svg viewBox='0 0 24 24'>
    <path :d='path' />
  </svg>
</template>
