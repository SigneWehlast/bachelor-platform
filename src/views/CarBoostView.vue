<script setup>
import { ref, computed  } from 'vue';

//Components
import BreadcrumbsComp from '@/components/navigation/BreadcrumbsComp.vue';
import CarBoostTable from '@/components/CarBoostTable.vue';
import SearchBar from '@/components/filter/SearchBar.vue';
import Dropdown from '@/components/filter/Dropdown.vue';
import CalendarComp from '@/components/filter/CalendarComp.vue';
import CarBoostGraph from '@/components/CarBoostGraph.vue';

//Functions
import { useGoBack } from "@/utils/goBack";


const { showTable, goBack, show } = useGoBack();

const selectedIds = ref([]);
const isButtonDisabled = computed(() => selectedIds.value.length === 0);

const selectedOnly = computed(() => selectedIds.value);


const showSelected = () => {
  if (selectedIds.value.length === 0) return;
  show();
}

const goBackAndReset =() => {
  goBack();
  selectedIds.value = []; 
}

const displayOptions = [
  "Kundenavn",
  "Leads",
  "Ændring",
  "Tendens",
  "Status",
  "Sidst opdateret"
];
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
      <SearchBar />
      <Dropdown
        :options="displayOptions"
        :disableOptions="['Kundenavn', 'Leads', 'Tendens', 'Status']"
        label="Visning"
        >
      </Dropdown> 
      <CalendarComp />
    </div>

    <CarBoostTable 
      v-if="!showTable" 
      @update:selectedIds="ids => selectedIds = ids" 
      :hidePaginaiton="false"
    />
    <div v-else>
      <CarBoostGraph :selectedIds="selectedOnly" />
      <CarBoostTable 
        :highlightedIds="selectedOnly" 
        :showOnlySelected="true"
        :hidePagination="true"
      />
      </div>
  </div>
</template>