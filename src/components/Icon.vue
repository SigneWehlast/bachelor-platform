<script setup>
import { icons } from "@/config/icons.js"

const props = defineProps({
  name: { type: String, required: true },
})

const path = icons[props.name]
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    
  >
    <path :d="path" />
  </svg>
</template>