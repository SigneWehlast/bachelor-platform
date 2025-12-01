<script setup>
import { ref, computed, onMounted } from "vue";
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import CarsInNumbers from "@/components/filter/CarsInNumbers.vue";
import SearchBar from "@/components/filter/SearchBar.vue";
import { getCustomers } from "@/config/customerService";
import { sortByName } from "@/utils/sort";
import SaleTable from "@/components/SaleTable.vue";


const salesCustomers = ref([]);

const selectedCustomers = ref([]);

const isButtonDisabled = computed(() => selectedCustomers.value.length === 0);

onMounted(async () => {
  salesCustomers.value = await getCustomers();
});

function moveToSelected(customer) {
  salesCustomers.value = salesCustomers.value.filter(c => c.id !== customer.id);
  selectedCustomers.value.push(customer);
  sortByName(selectedCustomers.value);
}

function selectAllCustomers() {
  selectedCustomers.value.push(...salesCustomers.value);
  salesCustomers.value = [];
}

function removeAllCustomers() {
  salesCustomers.value.push(...selectedCustomers.value);
  selectedCustomers.value = [];
}

function moveToAvailable(customer) {
  selectedCustomers.value = selectedCustomers.value.filter(c => c.id !== customer.id);
  salesCustomers.value.push(customer);
  sortByName(salesCustomers.value);
}

function showCustomerData() {
  customerTableData.value = [...selectedCustomers.value];
  console.log("Data der vises i tabellen:", customerTableData.value);
}
</script>

<template>
  <div class="SalesView">
    <div class="SalesView__topbar"> <h1>Salg</h1>
      <button
        class="SalesView__button-next"
        :disabled="isButtonDisabled"
        @click="showCustomerData"
      >
        Vis valgte
      </button>
  </div>

  <p class="regular settings-breadcrumbs"><BreadcrumbsComp /> </p>
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
          :key="item.id"
          class="SalesView__customer-item h3"
          @click="moveToSelected(item)"
        >
          {{ item.name }}
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
          :key="item.id"
          class="SalesView__customer-item h3"
          @click="moveToAvailable(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</div>

<SaleTable/>

</template>
