<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { fetchCustomerChanges } from "@/services/customerChangesService";

const props = defineProps({
  customerLimit: {
    type: Number,
    default: null
  }
});

const customers = ref([]);

const currentPage = ref(1);
const pageSize = 10;

onMounted(async () => {
  customers.value = await fetchCustomerChanges();
});

const showCustomers = computed(() => {
  if (props.customerLimit !== null && Number.isFinite(props.customerLimit)) {
    return customers.value.slice(0, props.customerLimit);
  }
  return customers.value;
});

const showPagination = computed(() => props.customerLimit === null);

const totalPages = computed(() => {
  if (!showPagination.value) return 1;
  return Math.max(1, Math.ceil(showCustomers.value.length / pageSize));
});

const paginatedCustomers = computed(() => {
  if (!showPagination.value) return showCustomers.value;
  const start = (currentPage.value - 1) * pageSize;
  return showCustomers.value.slice(start, start + pageSize);
});

watch(totalPages, (tp) => {
  if (currentPage.value > tp) currentPage.value = tp;
  if (currentPage.value < 1) currentPage.value = 1;
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>
<template>
  <table class="latest-customer-changes__content">
    <thead>
      <tr>
        <th class="latest-customer-changes__content-title h3">Kundenavn</th>
        <th class="latest-customer-changes__content-title h3">Dato</th>
      </tr>
    </thead>
    <tbody class="">
      <tr v-for="customer in paginatedCustomers"
          :key="customer.id"
          :class="{ 'recent-change': customer.isRecent }">
        <td class="text-medium">{{ customer.name }}</td>
        <td class="text-medium">{{ customer.date }}</td>
      </tr>
    </tbody>
  </table>
  <div v-if="props.customerLimit === null" class="latest-customer-changes__pagination">
    <div>Viser side {{ currentPage }} ud af {{ totalPages }}</div>
    <div>
      <button class="latest-customer-changes__pagination-button" @click="prevPage" :disabled="currentPage === 1">Forrige</button>
      <button class="latest-customer-changes__pagination-button" @click="nextPage" :disabled="currentPage === totalPages">Næste</button>
    </div>
  </div>
</template>
