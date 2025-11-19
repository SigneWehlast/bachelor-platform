<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavigationComp from './components/navigation/NavigationComp.vue';
</script>

<template>
  <header>
    <div class="wrapper">

<NavigationComp></NavigationComp>
    </div>
  </header>

  <RouterView />
</template>

