<script setup>
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import CarBoostTable from '@/components/CarBoostTable.vue';
import SearchBar from '@/components/filter/SearchBar.vue';
import DisplayComp from '@/components/filter/DisplayComp.vue';
import CalendarComp from '@/components/filter/CalendarComp.vue';

</script>
<template>  
  <div class="car-boost-view">
    <h1 class="carboost-view-title">CarBoost</h1>
    <BreadcrumbsComp/>
    <div class="carboost-view__filter">
      <SearchBar />
      <DisplayComp />
      <CalendarComp />
    </div>
    <CarBoostTable />
  </div>
</template>