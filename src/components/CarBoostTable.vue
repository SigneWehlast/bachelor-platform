<script setup>
import { ref, onMounted, defineEmits } from "vue";
import BaseTable from './BaseTable.vue';
import { getCustomersInCarboost } from "@/config/carboostService";
import Icon from "@/components/Icon.vue"

const carboostCustomers = ref([]);
const selectedIds = ref([]);
const currentPage = ref(1);
const pageSize = 10;
const totalPages = ref(1);

const emit = defineEmits(["update:selectedIds"]);

async function fetchPage(page) {
  const { customers, totalCount } = await getCustomersInCarboost(page, pageSize);
  carboostCustomers.value = customers;
  totalPages.value = Math.ceil(totalCount / pageSize);
}

onMounted(() => {
  fetchPage(currentPage.value);
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchPage(currentPage.value);
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchPage(currentPage.value);
  }
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
        <th class="carboost-table__text--leftalign">Kundenavn</th>
        <th>Leads</th>
        <th>Ændring</th>
        <th>Tendens</th>
        <th>Status</th>
        <th class="carboost-table__text--leftalign">Sidst opdateret</th>
      </template>

      <template #rows>
        <tr v-for="item in carboostCustomers" :key="item.id" class="carboost-table__rows">
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
            {{ item.change !== null ? item.change : "-" }}
          </td>
          <td class="carboost-table__text--center">

              <Icon v-if="item.tendens === 'up'" name='ArrowUpBold'
                class="carboost-table__text-icon carboost-table__text-icon--up" 
            />
              <Icon v-else-if="item.tendens === 'down'"name='ArrowDownBold'
                class="carboost-table__text-icon carboost-table__text-icon--down" 
            />
            <span v-else-if="item.tendens === '-'">-</span>
            <span v-else>-</span>
          </td>
          <td class="carboost-table__text--center">
            <Icon 
              v-if="item.yesterdays_dif > 0 && (item.todays_dif / item.yesterdays_dif) < 0.5" 
              name='AlertCircle'
              class="carboost-table__text-icon carboost-table__text-icon-alert--red" 
            />
            <Icon 
              v-else-if="item.yesterdays_dif > 0 && (item.todays_dif / item.yesterdays_dif) < 0.6 && (item.todays_dif / item.yesterdays_dif) > 0.5" 
              name='Alert'
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
      <div>Viser side {{ currentPage }} ud af {{ totalPages }} </div>
      <div>
        <button class="carboost-table__pagination-button" @click="prevPage" :disabled="currentPage === 1">Forrige</button>
        <button class="carboost-table__pagination-button" @click="nextPage">Næste</button>
      </div>
    </div>
  </div>
</template>
