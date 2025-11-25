<script setup>
import { ref } from "vue";
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import CarsInNumbers from "@/components/filter/CarsInNumbers.vue";
import SearchBar from "@/components/filter/SearchBar.vue";

const salesCustomers = ref([
  "Auto-House Køge Hvidovre",
  "Autotorvet",
  "Billi Billi",
  "RST Biler",
  "SIXT Bilsag",
  "Thomens Auto",
]);

const selectedCustomers = ref([]);

// Flyt fra venstre -> højre
function moveToSelected(customer) {
  salesCustomers.value = salesCustomers.value.filter(c => c !== customer);
  selectedCustomers.value.push(customer);
}

function SelectAllSelected(customer){
  selectedCustomers.value = salesCustomers.value.filter (c=> c !== customer);
}

function selectAllCustomers() {
  selectedCustomers.value.push(...salesCustomers.value);
  salesCustomers.value = [];
}

function removeAllCustomers() {
  salesCustomers.value.push(...selectedCustomers.value);
  selectedCustomers.value = [];
}

// Flyt fra højre -> venstre
function moveToAvailable(customer) {
  selectedCustomers.value = selectedCustomers.value.filter(c => c !== customer);
  salesCustomers.value.push(customer);
}
</script>

<template>
  <div class="SalesView">
    <div class="SalesView__topbar"> <h1>Salg</h1>
      <button class="SalesView__button-next">Vis valgte</button>
  </div>

  <p class="regular settings-breadcrumbs"> <!--settings breadcrum??? --> <BreadcrumbsComp /> </p>
<div class="SalesView__filter-section">
<CarsInNumbers/>
<SearchBar/>
</div>
    <!-- Ikke valgte kunder -->
  <div class="SalesView__wrapper"> 
    <div class="SalesView__customer-list">
      <div class="SalesView__controls">
        <p class="text-medium">Virksomheder</p>
        <button class="SalesView__button" @click="selectAllCustomers">Vælg alle</button>
      </div>

      <ul>
        <li
          v-for="item in salesCustomers"
          :key="item"
          class="SalesView__customer-item h3"
          @click="moveToSelected(item)"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- Valgte kunder -->
    <div class="SalesView__customer-list SalesView__customer-list--selected">
      <div class="SalesView__controls">
      <p class="text-medium">Valgte kunder</p>
      <button class="SalesView__button" @click="removeAllCustomers">Fjern alle</button>
    </div>
      <ul>
        <li
          v-for="item in selectedCustomers"
          :key="item"
          class="SalesView__customer-item h3"
          @click="moveToAvailable(item)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</div>
</template>
