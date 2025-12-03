<script setup>
import { ref, onMounted, computed, defineEmits  } from "vue";
import BaseTable from './BaseTable.vue';
import { getCustomersInCarboost } from "@/config/carboostService";
import Icon from "@/components/Icon.vue";

const carboostCustomers = ref([]);
const selectedIds = ref([]);
const currentPage = ref(1);
const pageSize = 10;
const totalPages = ref(1);

const sortTableBy = ref("name");
const sortDirection = ref("asc");

const emit = defineEmits(["update:selectedIds"]);

async function fetchAll() {
  const { customers } = await getCustomersInCarboost(1, 99999);
  carboostCustomers.value = customers;
  totalPages.value = Math.ceil(carboostCustomers.value.length / pageSize);
}

onMounted(fetchAll);

function sortBy(col) {
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
      sortDirection.value === "asc" ? a.change - b.change : b.change - a.change
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

  return list;
});

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return sortedCustomers.value.slice(start, start + pageSize);
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function toggleSelection(id) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(i => i !== id);
  } else {
    selectedIds.value.push(id);
  }
  emit("update:selectedIds", selectedIds.value);
}
</script>

<template>
  <div class="carboost-table">
    <BaseTable>
      <template #header>
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
      <template #rows>
        <tr v-for="item in paginatedCustomers" :key="item.id" class="carboost-table__rows">
          <td class="carboost-table__text--leftalign">
            <input 
              type="checkbox" 
              :value="item.id" 
              :checked="selectedIds.includes(item.id)" 
              @change="toggleSelection(item.id)" 
            /> {{ item.name }}
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
              v-else-if="item.yesterdays_dif > 0 && (item.todays_dif / item.yesterdays_dif) < 0.3 && (item.todays_dif / item.yesterdays_dif) > 0.5"
              name="Alert"
              class="carboost-table__text-icon carboost-table__text-icon-alert--yellow"
            />
            <span v-else>-</span>
          </td>
          <td class="carboost-table__text--leftalign">
            {{ new Date(item.last_updated).toLocaleDateString() }}
          </td>
        </tr>
      </template>
    </BaseTable>

    <div class="carboost-table__pagination">
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
