<script setup>
//Utils
import { trackingStore } from '@/utils/trackingStore';
</script>

<template>
<div class='breadcrumbs text-light'>
  <template v-for='(crumb, index) in trackingStore.breadcrumbs' :key='index'>
    <RouterLink
      v-if="crumb.path"
      :to="crumb.path"
      class='breadcrumbs__item'
      :class="{ 'breadcrumbs__item--active': index === trackingStore.breadcrumbs.length - 1 }"
    >
      {{ crumb.label }}
    </RouterLink>
    <span
      v-else
      class='breadcrumbs__item'
    >
      {{ crumb.label }}
    </span>

    <span
      v-if='index < trackingStore.breadcrumbs.length - 1'
      class='breadcrumbs__separator'
    >
      /
    </span>
  </template>
</div>
</template>