<script setup>
import { ref, computed, watch } from 'vue';

//Components
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import CarBoostTable from '@/components/CarBoostTable.vue';
import SearchBar from '@/components/filter/SearchBar.vue';
import Dropdown from '@/components/filter/Dropdown.vue';
import CalendarComp from '@/components/filter/CalendarComp.vue';
import CarBoostGraph from '@/components/CarBoostGraph.vue';

//Functions
import { useGoBack } from "@/utils/goBack";

const searchQuery = ref("");

const { showTable, goBack, show } = useGoBack();

const selectedIds = ref([]);
const isButtonDisabled = computed(() => selectedIds.value.length === 0);

const selectedOnly = computed(() => selectedIds.value);

const selectedMonth = ref(null);


const showSelected = () => {
  if (selectedIds.value.length === 0) return;
  show();
}

const goBackAndReset =() => {
  goBack();
  selectedIds.value = []; 
}

const displayOptions = [
  { label: 'Kundenavn', value: 'name' },
  { label: 'Leads', value: 'leads' },
  { label: 'Ændring', value: 'change' },
  { label: 'Tendens', value: 'tendens' },
  { label: 'Status', value: 'status' },
  { label: 'Sidst opdateret', value: 'lastUpdated' }
];

const visibleColumns = ref([
  'name',
  'leads',
  'change',
  'tendens',
  'status',
  'lastUpdated'
]);

</script>
<template>  
  <div class="carboost-view">
    <div class="carboost-view__topbar">
      <div class="carboost-view__topbar-left">
        <h1 class="carboost-view__topbar-title">CarBoost</h1>
        <BreadcrumbsComp/> 
      </div>   

      <div class="carboost-view__topbar-btn-wrapper">
          <button 
          class="carboost-view__topbar-btn" @click="showSelected" :disabled="isButtonDisabled" v-if="!showTable">
          Vis valgte
        </button>

        <button class="carboost-view__topbar-btn" v-else @click="goBackAndReset">
          Tilbage
        </button>

        <button v-if="showTable" class="carboost-view__topbar-btn">
          Godkend Data
        </button>
      </div>

    </div>
    <div class="carboost-view__filter">
      <SearchBar v-if="!showTable" v-model="searchQuery" />
      <Dropdown
        v-model="visibleColumns"
        :options="displayOptions"
        :disableOptions="[
          'name',
          'leads',
          'tendens',
          'status'
        ]"
        label="Visning"
        multiple
        :alwaysShowLabel="true"
      />
      <CalendarComp v-model="selectedMonth" />
    </div>
    <CarBoostTable
      v-if="!showTable"
      v-model:search="searchQuery"
      @update:selectedIds="ids => selectedIds = ids"
      :selectedMonth="selectedMonth"
      :visibleColumns="visibleColumns"
    />
    <div v-else class="carboost-view__show-selected-customers">
    <CarBoostGraph 
      :selectedIds="selectedOnly" 
      :selectedMonth="selectedMonth" 
      :customers="customersList"
    />      
    <CarBoostTable
        :highlightedIds="selectedOnly"
        :showOnlySelected="true"
        :hidePagination="true"
        :selectedMonth="selectedMonth"
        :visibleColumns="visibleColumns"
      />
    </div>
  </div>
</template>