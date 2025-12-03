<script setup>
import { ref } from 'vue';
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import CarBoostTable from '@/components/CarBoostTable.vue';
import SearchBar from '@/components/filter/SearchBar.vue';
import DisplayComp from '@/components/filter/DisplayComp.vue';
import CalendarComp from '@/components/filter/CalendarComp.vue';
import CarBoostGraph from '@/components/CarBoostGraph.vue';

const showGraph = ref(false);


</script>
<template>  
  <div class="carboost-view">
    <div class="carboost-view__topbar">
      <div class="carboost-view__topbar-left">
        <h1 class="carboost-view__topbar-title">CarBoost</h1>
        <BreadcrumbsComp/> 
      </div>   
      <button class="carboost-view__topbar-btn" @click="showGraph = !showGraph">Vis valgte</button>
    </div>
    <div class="carboost-view__filter">
      <SearchBar />
      <DisplayComp />
      <CalendarComp />
    </div>
    <CarBoostTable v-if="!showGraph" @update:selectedIds="ids => selectedIds = ids" />
      <CarBoostGraph v-else :selectedIds="selectedIds" />
  </div>
</template>