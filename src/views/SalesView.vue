<script setup>
import { ref, computed, onMounted } from "vue";

//Componetns
import SaleTable from "@/components/SaleTable.vue";
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import Dropdown from "@/components/filter/Dropdown.vue";
import SearchBar from "@/components/filter/SearchBar.vue";
import CalendarComp from "@/components/filter/CalendarComp.vue";
import CustomerName from "@/components/filter/CustomerName.vue";
import ExportData from "@/components/filter/ExportData.vue";
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue";

//Express server data import
import { getCustomers, getSelectedCustomers } from "@/config/customerService";

//Functions
import { sortByName } from "@/utils/sort";
import { useGoBack } from "@/utils/goBack";


const showId = ref(false);
const clicked = ref(false); 
const confirm = ref(false);

function anonymize() {
  if (!clicked.value) {
    clicked.value = true;
    showId.value = !showId.value;
  } else {
    confirm.value = true;
  }
}

function handleModalYes() {
  clicked.value = false;
  showId.value = false;
  confirm.value = false;
}

function handleModalNo() {
  confirm.value = false;
}

const { showTable, goBack, show } = useGoBack();

const customerTableData = ref([]);

const salesCustomers = ref([]);

const selectedCustomers = ref([]);

const isButtonDisabled = computed(() => selectedCustomers.value.length === 0);

const selectedCarsFilter = ref(null);

const filteredCustomers = computed(() => {
  if (!selectedCarsFilter.value || selectedCarsFilter.value === "Alle") return salesCustomers.value;

  const [min, maxText] = selectedCarsFilter.value.split(" - ");
  const minNum = parseInt(min);
  const maxNum = maxText.includes("+")
    ? Infinity
    : parseInt(maxText.replace(" biler", ""));

  return salesCustomers.value.filter(c => {
    return c.numberOfCars >= minNum && c.numberOfCars <= maxNum;
  });
});

onMounted(async () => {
  salesCustomers.value = await getCustomers();
  console.log("Første kunde:", salesCustomers.value[10]);

});

function moveToSelected(customer) {
  salesCustomers.value = salesCustomers.value.filter(c => c.id !== customer.id);
  selectedCustomers.value.push(customer);
  sortByName(selectedCustomers.value);
}
function selectAllCustomers() {
  const toSelect = filteredCustomers.value.filter(
    c => !selectedCustomers.value.some(s => s.id === c.id)
  );

  selectedCustomers.value.push(...toSelect);
  salesCustomers.value = salesCustomers.value.filter(
    c => !toSelect.some(s => s.id === c.id)
  );

  sortByName(selectedCustomers.value);
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

const carsOptions = [
  "Alle",
  "0 - 25 biler",
  "26 - 50 biler",
  "51 - 75 biler",
  "76 - 100 biler",
  "101 - 125 biler",
  "126 - 150 biler",
  "151 - 175 biler",
  "176 - 200 biler",
  "201 - 225 biler",
  "226 - 250 biler",
  "251 - 275 biler",
  "275+ biler"
];

const displayOptions = [
  "Kundenavn",
  "Antal biler",
  "Samlet budget",
  "Konverteringer",
  "Carboost konverteringer",
  "Budget",
  "antal konverteringer i procent"
];
</script>

<template>
  <div class="SalesView">
    <div class="SalesView__topbar"> <h1>Salg</h1>

    <div class="SalesView__buttons-wrapper">
      <button v-if="showTable" class="SalesView__button-back" @click="goBack">Tilbage</button>
      <button v-if="!showTable" class="SalesView__button-next" :disabled="isButtonDisabled" @click="showCustomerData">Vis valgte</button>
      <button v-if="showTable" class="SalesView__button-anonymize" @click="anonymize">
        <p v-if="!clicked">Anonymiser</p>
        <p v-else="!confirm">Vis data</p>
      </button>
    </div>
  </div>

  <ConfirmationModal 
  v-if="confirm" 
  @yes="handleModalYes" 
  @no="handleModalNo" 
/>
  <p class="regular settings-breadcrumbs"><BreadcrumbsComp /> </p>
<!-- Før valgte kunder (false)-->
  <div v-if="!showTable" class="SalesView__filter-section">
    <Dropdown
    :options="carsOptions"
    label="Antal biler"
    v-model="selectedCarsFilter"
  />  
    <SearchBar />
  </div>

<!-- Efter valgte kunder (true) -->
  <div v-if="showTable" class="SalesView__filter-section">
    <Dropdown
      :options="displayOptions"
      label="Visning"
      :disableOptions="['Kundenavn', 'Antal biler']"
    />
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
    v-for="item in filteredCustomers"
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

<div>
  <SaleTable v-if="showTable" :carsData="customerTableData" v-model:showId="showId" />
</div>
</template>