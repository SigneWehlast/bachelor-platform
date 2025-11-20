<script setup>
import {RouterView } from 'vue-router'
import NavigationComp from './components/navigation/NavigationComp.vue';
</script>

<template>
  <div class="view">
    <header>
      <div>

        <NavigationComp />
      </div>
    </header>
    <main class="view__page">
      <RouterView />
    </main>
  </div>
</template>

