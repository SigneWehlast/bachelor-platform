<script setup>
import { ref, computed, onMounted } from "vue";

//Componetns
import SaleTable from "@/components/SaleTable.vue";
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import CarsInNumbers from "@/components/filter/CarsInNumbers.vue";
import SearchBar from "@/components/filter/SearchBar.vue";
import DisplayComp from "@/components/filter/DisplayComp.vue";
import CalendarComp from "@/components/filter/CalendarComp.vue";
import CustomerName from "@/components/filter/CustomerName.vue";
import ExportData from "@/components/filter/ExportData.vue";

//Funktions
import { getCustomers, getSelectedCustomers } from "@/config/customerService";
import { sortByName } from "@/utils/sort";
import { useGoBack } from "@/utils/goBack";


const showId = ref(false);
const clicked = ref(false); 

function anonymize() {
  clicked.value = !clicked.value;
  showId.value = !showId.value;
}

const { showTable, goBack, show } = useGoBack();

const customerTableData = ref([]);

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

async function showCustomerData() {
  if (selectedCustomers.value.length === 0) return;
  const idsArray = selectedCustomers.value.map(c => c.id);
  const data = await getSelectedCustomers(idsArray);
  customerTableData.value = data;

  show();
}
</script>

<template>
  <div class="SalesView">
    <div class="SalesView__topbar"> <h1>Salg</h1>

    <div class="SalesView__buttons-wrapper">
      <button v-if="showTable" class="SalesView__button-back" @click="goBack">Tilbage</button>
      <button v-if="!showTable" class="SalesView__button-next" :disabled="isButtonDisabled" @click="showCustomerData">Vis valgte</button>
      <button v-if="showTable" class="SalesView__button-anonymize" @click="anonymize">
        <p v-if="!clicked">Anonymiser</p>
        <p v-else>Vis data</p>
      </button>
    </div>
  </div>

  <p class="regular settings-breadcrumbs"><BreadcrumbsComp /> </p>
<!-- Før valgte kunder (false)-->
  <div v-if="!showTable" class="SalesView__filter-section">
    <CarsInNumbers />
    <SearchBar />
  </div>

<!-- Efter valgte kunder (true) -->
  <div v-if="showTable" class="SalesView__filter-section">
    <DisplayComp />
    <CalendarComp />
    <CustomerName />
    <ExportData />
  </div>
    <!-- Ikke valgte kunder -->
  <div v-if="!showTable" class="SalesView__wrapper"> 
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
        {{ item.name}}
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

<div>
  <SaleTable v-if="showTable" :carsData="customerTableData" v-model:showId="showId" />
</div>
</template>