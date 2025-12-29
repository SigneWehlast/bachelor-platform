<script setup>
import { RouterView, useRoute } from 'vue-router';
import { onMounted } from 'vue';
import NavigationComp from './components/navigation/NavigationComp.vue';
import { loadSettings } from '@/services/notificationService';

const route = useRoute();

onMounted(() => {
  loadSettings();
});
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
