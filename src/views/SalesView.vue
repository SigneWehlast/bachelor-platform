<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// Components
import SaleTable from '@/components/SaleTable.vue';
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import Dropdown from '@/components/filter/Dropdown.vue';
import SearchBar from '@/components/filter/SearchBar.vue';
import CalendarComp from '@/components/filter/CalendarComp.vue';
import ExportData from '@/components/filter/ExportData.vue';
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue';

// Services
import { getCustomers, getSelectedCustomers } from '@/services/customerService';
import { getHistorySales } from '@/services/historyService';

// Utils
import { sortByName } from '@/utils/sort';
import { useGoBack } from '@/utils/goBack';
import { useSearchFilter } from '@/utils/searchFilter';
import { usePagination } from '@/utils/pagination';


// State
const showId = ref(false);
const clicked = ref(false);
const confirm = ref(false);
const salesCustomers = ref([]);
const selectedCustomers = ref([]);
const customerTableData = ref([]);
const selectedMonth = ref(null);

// Composable for search & filter
const { searchQuery, filterValue: selectedCarsFilter, filteredItems: filteredCustomers } = useSearchFilter(
  salesCustomers,
  'name',          // søgefelt
  'numberOfCars'   // filterfelt
);

// Go back utility
const { showTable, goBack, show } = useGoBack();

// Buttons
const isButtonDisabled = computed(() => selectedCustomers.value.length === 0);

// Options
const carsOptions = [
  'Alle',
  '0 - 25 biler',
  '26 - 50 biler',
  '51 - 75 biler',
  '76 - 100 biler',
  '101 - 125 biler',
  '126 - 150 biler',
  '151 - 175 biler',
  '176 - 200 biler',
  '201 - 225 biler',
  '226 - 250 biler',
  '251 - 275 biler',
  '275+ biler'
];

const displayOptions = [
  { label: 'Kundenavn', value: 'name' },
  { label: 'Antal biler', value: 'numberOfCars' },
  { label: 'Samlet budget', value: 'totalBudget' },
  { label: 'Konverteringer', value: 'conversions' },
  { label: 'Carboost konverteringer', value: 'carboostConversions' },
  { label: 'Budget', value: 'budget' },
  { label: 'Antal konverteringer i procent', value: 'conversionsPercent' }
];

const visibleColumns = ref ([
  'name',
  'numberOfCars',
  'totalBudget',
  'conversions',
  'carboostConversions',
  'budget',
  'conversionsInProcent'
]);

// Functions
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

const filteredByMonthTableData = computed(() => {
  if (!selectedMonth.value) return customerTableData.value;

  return customerTableData.value.filter(item => {
    const date = new Date(item.archived_at);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return month === selectedMonth.value;
  });
});


async function showCustomerData() {
  if (selectedCustomers.value.length === 0) return;

  const selectedIds = selectedCustomers.value.map(c => c.id);

  if (!selectedMonth.value) {
    customerTableData.value = await getSelectedCustomers(selectedIds);
    show();
    return;
  }

  const { history } = await getHistorySales(selectedIds);
  const [selYear, selMonth] = selectedMonth.value.split('-').map(Number);

  const filtered = history.filter(item => {
    if (!selectedIds.includes(item.id)) return false;

    const [year, month] = item.archived_at.split(' ')[0].split('-').map(Number);
    return year === selYear && month === selMonth;
  });

  const latestPerCustomer = {};
  filtered.forEach(item => {
    const current = latestPerCustomer[item.id];
    if (!current) {
      latestPerCustomer[item.id] = item;
    } else {
      if (new Date(item.archived_at) > new Date(current.archived_at)) {
        latestPerCustomer[item.id] = item;
      }
    }
  });

  customerTableData.value = Object.values(latestPerCustomer);
  show();
}

onMounted(async () => {
  salesCustomers.value = await getCustomers();
});

const pageSize = 10;

const {
  currentPage: selectedCurrentPage,
  totalPages: selectedTotalPages,
  paginatedItems: paginatedSelectedCustomers,
  nextPage: nextSelectedPage,
  prevPage: prevSelectedPage,
  resetPage: resetSelectedPage
} = usePagination(filteredByMonthTableData, pageSize);


const paginatedTableData = computed(() => {
  return paginatedSelectedCustomers.value;
});

watch(selectedMonth, () => {
  resetSelectedPage();
});

watch(selectedMonth, async () => {
  if (selectedCustomers.value.length === 0) return;
  await showCustomerData();
});
</script>
<template>
  <div class='sales-view'>
    <div class='sales-view__topbar'>
      <h1>Salg</h1>
      <div class='sales-view__buttons-wrapper'>
        <button v-if='showTable' class='sales-view__button-back' @click='goBack'>Tilbage</button>
        <button v-if='!showTable' class='sales-view__button-next' :disabled='isButtonDisabled' @click='showCustomerData'>Vis valgte</button>
        <button v-if='showTable' class='sales-view__button-anonymize' @click='anonymize'>
          <p v-if='!clicked'>Anonymiser</p>
          <p v-else='!confirm'>Vis data</p>
        </button>
      </div>
    </div>
    <ConfirmationModal
      v-if='confirm'
      @yes='handleModalYes'
      @no='handleModalNo'
    />
    <p class='regular settings-breadcrumbs'>
      <BreadcrumbsComp />
    </p>
    <div v-if='!showTable' class='sales-view__filter-section'>
      <SearchBar v-model='searchQuery' />
      <Dropdown
      :options='carsOptions'
      label='Antal biler'
      v-model='selectedCarsFilter'
    />
    </div>

  <div v-if='showTable' class='sales-view__filter-section sales-view__filter-section__selected'>
    <div class='sales-view__filter-section__selected-dropdowns'>
      <Dropdown
        :options='displayOptions'
        label='Visning'
        :disableOptions='["name", "numberOfCars"]'
        v-model='visibleColumns'
        multiple
        :alwaysShowLabel='true'
      />
      <CalendarComp v-model='selectedMonth' :hide-day-option='true' />
    </div>
    <ExportData />
  </div>

  <div v-if='!showTable' class='sales-view__wrapper'>
    <div class='sales-view__customer-list'>
      <div class='sales-view__controls'>
        <p class='text-medium'>Virksomheder</p>
        <button class='sales-view__button' @click='selectAllCustomers'>Vælg alle</button>
      </div>
      <ul>
        <li
          v-for='item in filteredCustomers'
          :key='item.id'
          class='sales-view__customer-item h3'
          @click='moveToSelected(item)'
        >
          {{ item.name }}
        </li>
      </ul>
    </div>

      <div class='sales-view__customer-list sales-view__customer-list--selected'>
        <div class='sales-view__controls'>
          <p class='text-medium'>Valgte kunder</p>
          <button class='sales-view__button' @click='removeAllCustomers'>Fjern alle</button>
        </div>
        <ul>
          <li
            v-for='item in selectedCustomers'
            :key='item.id'
            class='sales-view__customer-item h3'
            @click='moveToAvailable(item)'
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class='sales-view__table-view'>
      <SaleTable
        v-if='showTable'
        :carsData='paginatedTableData'
        v-model:showId='showId'
        :visibleColumns='visibleColumns'
        v-model='selectedMonth'
      />
      <div class='sales-view__pagination' v-if='showTable'>
        <span>Viser side {{ selectedCurrentPage }} ud af {{ selectedTotalPages }}</span>
        <div>
          <button class='sales-view__pagination-button' @click='prevSelectedPage' :disabled='selectedCurrentPage === 1'>Forrige</button>
          <button class='sales-view__pagination-button' @click='nextSelectedPage' :disabled='selectedCurrentPage === selectedTotalPages'>Næste</button>
        </div>
      </div>
    </div>
  </div>
</template>