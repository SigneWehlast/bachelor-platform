<script setup>
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import LatestCustomerChangesContent from '../components/dashboard/LatestCustomerChangesContent.vue';
import SearchBar from '@/components/filter/SearchBar.vue';
</script>
<template>
  <div class="customer-changes">
    <h1>Seneste kundeændringer</h1> <!--icon-->
    <BreadcrumbsComp />
    <div>
      <SearchBar />
      <!--kalender-->
    </div>
    <div class="customer-changes__content">
      <latest-customer-changes-content layout="gap" />
    </div>
  </div>
</template>