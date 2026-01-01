<script setup>
import { ref } from 'vue';
//Components
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import LatestCustomerChangesContent from '../components/dashboard/LatestCustomerChangesContent.vue';
import SearchBar from '@/components/filter/SearchBar.vue';
import Tooltip from '@/components/Tooltip.vue';

//Const
const searchQuery = ref('');
</script>

<template>
  <div class="customer-changes">
    <div class="customer-changes__text">
      <h1>Seneste kundeændringer</h1><Tooltip type="customerChanges"/>
    </div>
    <BreadcrumbsComp />
    <div>
      <SearchBar v-model='searchQuery' />
    </div>
    <div class='customer-changes__content'>
      <latest-customer-changes-content v-model:search='searchQuery'/>
    </div>
  </div>
</template>