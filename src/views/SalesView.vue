<script setup>
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';

const salesCustomers = [
 "Auto-House Køge Hvidovre",
 "Autotorvet",
 "Billi Billi",
 "RST Biler",
 "SIXT Bilsag",
 "Thomens Auto",
]


</script>
<template>
  


<div class="SalesView">

    <div class="SalesView__topbar">
      <h1>Salg</h1>
    </div>

    <p class="regular settings-breadcrumbs">  <!--settings breadcrum??? -->
      <BreadcrumbsComp />
    </p>

    <p>filter funktioner her!!! (Søg og antal biler)</p>

    <!-- Ikke valgte kunder -->
    <div class="SalesView__customer-list">
      <div class="SalesView__controls">
        <p class="text-medium">Virksomheder</p>
        <button class="SalesView__button">Vælg alle</button>
      </div>
      <ul>
        <li
          v-for="item in salesCustomers"
          :key="item"
          class="SalesView__customer-item h3"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- Valgte kunder -->
    <div class="SalesView__customer-list SalesView__customer-list--selected">
    </div>

</div>


</template>