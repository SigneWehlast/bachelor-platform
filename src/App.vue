<script setup>
import {RouterView, useRoute } from 'vue-router';
import NavigationComp from './components/navigation/NavigationComp.vue';

const route = useRoute();
</script>


<template>
  <template v-if="route.meta.layout === 'none'">
    <RouterView />
  </template>
  <template v-else>
    <div class='view'>
      <header>
        <NavigationComp />
      </header>

      <main class='view__page'>
        <RouterView />
      </main>
    </div>
  </template>
</template>
