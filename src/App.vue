<script setup>
import {RouterView } from 'vue-router'
import NavigationComp from './components/navigation/NavigationComp.vue';
</script>

<template>
  <header>
    <div>

<NavigationComp></NavigationComp>
    </div>
  </header>

  <RouterView />
</template>

