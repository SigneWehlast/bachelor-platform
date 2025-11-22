<script setup>
import { trackingStore } from "@/utils/trackingStore";
console.log(trackingStore)
</script>

<template>
  <div class="breadcrumbs text-light">
    <span
      v-for="(crumb, index) in trackingStore.breadcrumbs"
      :key="index"
      class="breadcrumbs__item"
      :class="{ 'breadcrumbs__item--active': index === trackingStore.breadcrumbs.length - 1 }"
    >
      {{ crumb }}
      <span
        v-if="index < trackingStore.breadcrumbs.length - 1"
        class="breadcrumbs__separator"
      >
        /
      </span>
    </span>
  </div>
</template>