<script setup>
import { trackingStore } from '@/utils/trackingStore';
</script>

<template>
  <div class='breadcrumbs text-light'>
    <RouterLink
      v-for='(crumb, index) in trackingStore.breadcrumbs'
      :key='index'
      :to='crumb.path'
      class='breadcrumbs__item'
      :class="{ 'breadcrumbs__item--active': index === trackingStore.breadcrumbs.length - 1 }"
    >
      {{ crumb.label }}

      <span
        v-if='index < trackingStore.breadcrumbs.length - 1'
        class='breadcrumbs__separator'
      >
        /
      </span>
    </RouterLink>
  </div>
</template>