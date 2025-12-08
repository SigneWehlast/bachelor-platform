<script setup>
import { ref, onMounted, computed, defineEmits  } from "vue";
import BaseTable from './BaseTable.vue';
import { getCustomersInCarboost } from "@/config/carboostService";
import Icon from "@/components/Icon.vue";
import ShowCustomerCarBoostModal from "./modals/ShowCustomerCarBoostModal.vue";

const carboostCustomers = ref([]);
const selectedIds = ref([]);
const currentPage = ref(1);
const pageSize = 10;
const totalPages = ref(1);

const showModal = ref(false);
const selectedCustomer = ref(null);

const sortTableBy = ref("name");
const sortDirection = ref("asc");

const emit = defineEmits(["update:selectedIds"]);

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
  hideCheckbox: {
    type: Boolean,
    default: false
  },
  tableInModal: {
    type: Boolean,
    default: false
  }
});

function getMonthlyLeads(history) {
  const grouped = {};

  history.forEach(item => {
    const date = new Date(item.archived_at);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const key = `${year}-${month.toString().padStart(2, '0')}`;

    if (!grouped[key]) {
      grouped[key] = {
        archived_at: item.archived_at,
        leads: item.leads || 0,
        period: date.toLocaleDateString("da-DK", { month: "long", year: "numeric" })
      };
    } else {
      grouped[key].leads += item.leads || 0;
      if (new Date(item.archived_at) > new Date(grouped[key].archived_at)) {
        grouped[key].archived_at = item.archived_at;
      }
    }
  });

  return Object.values(grouped);
}

const fetchAll = async () => {
  try {
    const response = await getCustomersInCarboost(1, 99999);
    const customers = response.customers || [];

    const result = [];

    customers.forEach(customer => {
      if (customer.history && customer.history.length > 0) {
        const monthly = getMonthlyLeads(customer.history);
        monthly.forEach(month => {
          result.push({
            ...customer,
            leads: month.leads,
            archived_at: month.archived_at,
            period: month.period
          });
        });
      } else {
        result.push(customer);
      }
    });

    carboostCustomers.value = result;
    totalPages.value = Math.ceil(carboostCustomers.value.length / pageSize);

  } catch (err) {
    console.error("Error fetching customers:", err);
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
  let list = [...carboostCustomers.value];

  if (sortTableBy.value === "name") {
    list.sort((a, b) =>
      sortDirection.value === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }

  if (sortTableBy.value === "leads") {
    list.sort((a, b) =>
      sortDirection.value === "asc" ? a.leads - b.leads : b.leads - a.leads
    );
  }

  if (sortTableBy.value === "change") {
    list.sort((a, b) =>
      sortDirection.value === "desc" ? a.change - b.change : b.change - a.change
    );
  }

  if (sortTableBy.value === "tendens") {
    const order = { up: 2, "-": 1, down: 0 };
    list.sort((a, b) =>
      sortDirection.value === "desc"
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

const paginatedCustomers = computed(() => {
  if (props.hidePagination) {
    return sortedCustomers.value;
  }
  const start = (currentPage.value - 1) * pageSize;
  return sortedCustomers.value.slice(start, start + pageSize);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
}

const toggleSelection = (id) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(i => i !== id);
  } else {
    selectedIds.value.push(id);
  }
  emit("update:selectedIds", selectedIds.value);
}

const openModalWithCustomer = (customer) => {
  selectedCustomer.value = customer;
  showModal.value = true;
};
</script>
<template>
  <div class="carboost-table">
    <BaseTable>
      <template #header>
        <template v-if="!props.tableInModal">
          <th @click="sortBy('name')" class="carboost-table__filter-title carboost-table__text--leftalign">
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
          <th @click="sortBy('change')" class="carboost-table__filter-title">
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
          <th>Status</th>
          <th class="carboost-table__text--leftalign">Sidst opdateret</th>
        </template>
        <template v-else>
          <th @click="sortBy('period')" class="carboost-table__filter-title carboost-table__text--leftalign">
            <Icon
              :name="sortTableBy === 'period' 
                      ? (sortDirection === 'asc' ? 'ArrowUpThin' : 'ArrowDownThin') 
                      : 'ArrowUpThin'" 
              class="carboost-table__filter-icon"
            />          
            Periode
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
          <th @click="sortBy('change')" class="carboost-table__filter-title">
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
            <td class="carboost-table__text--leftalign">
              {{ new Date(item.last_updated).toLocaleDateString() }}
            </td>        
          </template>
          <template v-else>
            <td class="carboost-table__text--leftalign">
              <input v-if="!props.hideCheckbox"
                type="checkbox" 
                :value="item.id" 
                :checked="selectedIds.includes(item.id)" 
                @change="toggleSelection(item.id)" 
              />  {{ item.period }}
            </td>
            <td class="carboost-table__text--center">{{ item.leads }}</td>
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
