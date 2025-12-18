<script setup>
import { ref, onMounted, computed, defineEmits, watch  } from "vue";
import BaseTable from './BaseTable.vue';
import { getCustomersInCarboost } from "@/services/carboostService";
import Icon from "@/components/Icon.vue";
import ShowCustomerCarBoostModal from "./modals/ShowCustomerCarBoostModal.vue";
import { getCustomersInCarboostByDate } from "@/services/carboostService"; 
import { getCustomersCarboostChange } from "@/services/carboostService";
import { useSearchFilter } from "@/utils/searchFilter";
import { usePagination } from "@/utils/pagination";

const carboostCustomers = ref([]);
const selectedIds = ref([]);
const showModal = ref(false);
const selectedCustomer = ref(null);
const pageSize = 10;

const sortTableBy = ref("name");
const sortDirection = ref("asc");

const emit = defineEmits(["update:selectedIds"]);

const { searchQuery, filteredItems } = useSearchFilter(
  carboostCustomers,
  "name"
);

const props = defineProps({
  customers: {
    type: Array,
    default: () => []
  },
  highlightedIds: {
    type: Array,
    default: () => []
  },
  showOnlySelected: {
    type: Boolean,
    default: false
  },
  hidePagination: {
    type: Boolean,
    default: false
  },
  tableInModal: {
    type: Boolean,
    default: false
  },
  selectedMonth: {
    type: String,
    default: null,
  },
    search: {
    type: String,
    default: ""
  },
  visibleColumns: {
    type: Array,
    required: true
  }
});

const fetchAll = async () => {
  try {
    let customers = [];

    if (!props.selectedMonth) {
      const res = await getCustomersInCarboost(1, 99999);
      customers = res.customers || [];
    } else {
      const { customers: leadsData = [] } = await getCustomersInCarboostByDate(props.selectedMonth);
      const { customers: changeData = [] } = await getCustomersCarboostChange(props.selectedMonth);

      customers = (leadsData || []).map(c => {
        const changeItem = (changeData || []).find(ch => ch.id === c.id) || {};
        return {
          ...c,
          change: changeItem.change || 0,
          todays_dif: changeItem.todays_dif || 0,
          yesterdays_dif: changeItem.yesterdays_dif || 0,
          tendens: changeItem.tendens || '-'
        };
      });
    }

    carboostCustomers.value = customers;
    totalPages.value = Math.ceil(carboostCustomers.value.length / pageSize);

  } catch (err) {
    console.error("fetchAll error:", err);
    carboostCustomers.value = [];
    totalPages.value = 1;
  }
};

onMounted(fetchAll);

const sortBy = (col) => {
  if (sortTableBy.value === col) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortTableBy.value = col;
    sortDirection.value = "desc";
  }
  currentPage.value = 1;
}

const sortedCustomers = computed(() => {
  let list = [...filteredItems.value];

  if (sortTableBy.value === "name") {
  list.sort((a, b) => {
    const nameA = a.name || "";
    const nameB = b.name || "";
    return sortDirection.value === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });
}

  if (sortTableBy.value === "leads") {
    list.sort((a, b) =>
      sortDirection.value === "asc" ? a.leads - b.leads : b.leads - a.leads
    );
  }

  if (sortTableBy.value === "change") {
    list.sort((a, b) =>
      sortDirection.value === "asc" ? a.change - b.change : b.change - a.change
    );
  }

  if (sortTableBy.value === "tendens") {
    const order = { up: 2, "-": 1, down: 0 };
    list.sort((a, b) =>
      sortDirection.value === "asc"
        ? order[a.tendens] - order[b.tendens]
        : order[b.tendens] - order[a.tendens]
    );
  } 
  
  if (props.showOnlySelected && props.highlightedIds.length > 0) {
    list = list.filter(item => props.highlightedIds.includes(item.id));
  }

  if (sortTableBy.value === "period") {
  list.sort((a, b) => {
    const dateA = new Date(a.archived_at);
    const dateB = new Date(b.archived_at);
    return sortDirection.value === "asc" ? dateA - dateB : dateB - dateA;
  });
}
  return list;
});

const toggleSelection = (id) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(i => i !== id);
  } else {
    selectedIds.value.push(id);
  }
  emit("update:selectedIds", selectedIds.value);
}

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedCustomers,
  nextPage,
  prevPage,
  resetPage
} = usePagination(sortedCustomers, 10, {
  disable: computed(() => props.hidePagination)
});

watch(() => props.selectedMonth, async () => {
  resetPage();
  selectedIds.value = [];
  await fetchAll();
});

const openModalWithCustomer = (customer) => {
  selectedCustomer.value = customer;
  showModal.value = true;
};

watch(
  () => props.search,
  (val) => {
    searchQuery.value = val;
    resetPage();
  },
  { immediate: true }
);

watch(filteredItems, () => {
  totalPages.value = Math.max(
    1,
    Math.ceil(filteredItems.value.length / pageSize)
  );
  resetPage();
});

const periodLabel = computed(() => {
  if (!props.selectedMonth) return "-";

  const [year, month] = props.selectedMonth.split("-");
  const date = new Date(year, month - 1, 1);

  return date
    .toLocaleDateString("da-DK", {
      month: "long",
      year: "numeric"
    })
    .replace(/^\w/, c => c.toUpperCase());
});

</script>
<template>
  <div class="carboost-table">
    <BaseTable>
      <template #header>
        <template v-if="!props.tableInModal">
          <th @click="sortBy('name')" class="carboost-table__filter-title-name carboost-table__text--leftalign">
            <Icon
              :name="sortTableBy === 'name' 
                      ? (sortDirection === 'asc' ? 'ArrowUpThin' : 'ArrowDownThin') 
                      : 'ArrowUpThin'" 
              class="carboost-table__filter-icon"
            />
            Kundenavn
          </th>
          <th @click="sortBy('leads')" class="carboost-table__filter-title">
            <Icon
              :name="sortTableBy === 'leads' 
                      ? (sortDirection === 'asc' ? 'ArrowUpThin' : 'ArrowDownThin') 
                      : 'ArrowUpThin'" 
              class="carboost-table__filter-icon"
            />          
            Leads
          </th>
          <th v-if="props.visibleColumns.includes('change')" @click="sortBy('change')" class="carboost-table__filter-title">
            <Icon
              :name="sortTableBy === 'change' 
                      ? (sortDirection === 'asc' ? 'ArrowUpThin' : 'ArrowDownThin') 
                      : 'ArrowUpThin'" 
              class="carboost-table__filter-icon"
            />          
            Ændring
          </th>
          <th @click="sortBy('tendens')" class="carboost-table__filter-title">
            <Icon
              :name="sortTableBy === 'tendens' 
                      ? (sortDirection === 'asc' ? 'ArrowUpThin' : 'ArrowDownThin') 
                      : 'ArrowUpThin'" 
              class="carboost-table__filter-icon"
            />
            Tendens
          </th>
          <th class="carboost-table__filter-title">Status</th>
          <th v-if="props.visibleColumns.includes('lastUpdated')" class="carboost-table__text--leftalign carboost-table__filter-title">Sidst opdateret</th>
        </template>
        <template v-else>
          <th class="carboost-table__filter-title carboost-table__text--leftalign">          
            Periode
          </th>
          <th class="carboost-table__filter-title">         
            Leads
          </th>
          <th class="carboost-table__filter-title">
            Ændring
          </th>
          <th class="carboost-table__filter-title">
            Tendens
          </th>
          <th>Status</th>
        </template>
      </template>
      <template #rows>
        <tr v-for="item in paginatedCustomers" :key="item.id" class="carboost-table__rows">
          <template v-if="!tableInModal">
            <td class="carboost-table__text--leftalign carboost-table__text-name">
              <input
                type="checkbox" 
                :value="item.id"
                :checked="selectedIds.includes(item.id)" 
                @change="toggleSelection(item.id)" 
              />
              <p @click="openModalWithCustomer(item)"> {{ item.name }} </p>
            </td>
            <td class="carboost-table__text--center">{{ item.leads }}</td>
            <td v-if="props.visibleColumns.includes('change')" class="carboost-table__text--center">
              {{ item.change ?? "-" }}
            </td>
            <td class="carboost-table__text--center">
              <Icon
                v-if="item.tendens === 'up'"
                name="ArrowUpBold"
                class="carboost-table__text-icon carboost-table__text-icon--up"
              />
              <Icon
                v-else-if="item.tendens === 'down'"
                name="ArrowDownBold"
                class="carboost-table__text-icon carboost-table__text-icon--down"
              />
              <span v-else>-</span>
            </td>
            <td class="carboost-table__text--center">
              <Icon
                v-if="item.yesterdays_dif > 0 && item.todays_dif / item.yesterdays_dif < 0.5"
                name="AlertCircle"
                class="carboost-table__text-icon carboost-table__text-icon-alert--red"
              />
              <Icon
                v-else-if="item.yesterdays_dif > 0 && (item.todays_dif / item.yesterdays_dif) < 0.7"
                name="Alert"
                class="carboost-table__text-icon carboost-table__text-icon-alert--yellow"
              />
              <span v-else>-</span>
            </td>
            <td v-if="props.visibleColumns.includes('lastUpdated')" class="carboost-table__text--leftalign">
              {{ new Date(item.last_updated).toLocaleDateString() }}
            </td>
          </template>
          <template v-else>
            <td class="carboost-table__text--leftalign">
              {{ periodLabel }}
            </td>
            <td class="carboost-table__text--center">{{ item.leads  }}</td>
            <td class="carboost-table__text--center">
              {{ item.change ?? "-" }}
            </td>
            <td class="carboost-table__text--center">
              <Icon
                v-if="item.tendens === 'up'"
                name="ArrowUpBold"
                class="carboost-table__text-icon carboost-table__text-icon--up"
              />
              <Icon
                v-else-if="item.tendens === 'down'"
                name="ArrowDownBold"
                class="carboost-table__text-icon carboost-table__text-icon--down"
              />
              <span v-else>-</span>
            </td>
            <td class="carboost-table__text--center">
              <Icon
                v-if="item.yesterdays_dif > 0 && item.todays_dif / item.yesterdays_dif < 0.5"
                name="AlertCircle"
                class="carboost-table__text-icon carboost-table__text-icon-alert--red"
              />
              <Icon
                v-else-if="item.yesterdays_dif > 0 && (item.todays_dif / item.yesterdays_dif) < 0.7"
                name="Alert"
                class="carboost-table__text-icon carboost-table__text-icon-alert--yellow"
              />
              <span v-else>-</span>
            </td>      
          </template>
        </tr>
      </template>
    </BaseTable>
    <ShowCustomerCarBoostModal 
      v-if="showModal"
      :customer="selectedCustomer"
      @close="showModal = false"
    />
    <div v-if="!props.hidePagination" class="carboost-table__pagination">
      <div>Viser side {{ currentPage }} ud af {{ totalPages }}</div>
      <div>
        <button class="carboost-table__pagination-button" @click="prevPage" :disabled="currentPage === 1">
          Forrige
        </button>
        <button class="carboost-table__pagination-button" @click="nextPage" :disabled="currentPage === totalPages">
          Næste
        </button>
      </div>
    </div>
  </div>
</template>
