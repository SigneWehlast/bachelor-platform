<script setup>
import { ref } from 'vue';
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import LatestCustomerChangesContent from '../components/dashboard/LatestCustomerChangesContent.vue';
import SearchBar from '@/components/filter/SearchBar.vue';

const searchQuery = ref('');
</script>
<template>
  <div class='customer-changes'>
    <h1>Seneste kundeændringer</h1> <!--icon-->
    <BreadcrumbsComp />
    <div>
      <SearchBar v-model='searchQuery' />
    </div>
    <div class='customer-changes__content'>
      <latest-customer-changes-content v-model:search='searchQuery'/>
    </div>
  </div>
</template>