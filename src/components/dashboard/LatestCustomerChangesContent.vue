<script setup>
  import { ref, computed, watch, onMounted } from "vue";
  import { fetchCustomerChanges } from "@/services/customerChangesService";
  import { useSearchFilter } from "@/utils/searchFilter";
  
  const props = defineProps({
    customerLimit: { type: Number, default: null },
    search: { type: String, default: "" }
  });
  
  const customers = ref([]);
  const currentPage = ref(1);
  const pageSize = 10;
  
  // SearchFilter
  const { searchQuery, filteredItems } = useSearchFilter(customers, "name");
  
  // Bind props.search til searchQuery
  watch(
    () => props.search,
    val => searchQuery.value = val,
    { immediate: true }
  );
  
  // Hent data
  onMounted(async () => {
    customers.value = await fetchCustomerChanges();
  });
  
  // Pagination
  const showPagination = computed(() => props.customerLimit === null);
  
  const totalPages = computed(() => {
    if (!showPagination.value) return 1;
    return Math.max(1, Math.ceil(filteredItems.value.length / pageSize));
  });
  
  const paginatedCustomers = computed(() => {
    if (!showPagination.value) return filteredItems.value;
    const start = (currentPage.value - 1) * pageSize;
    return filteredItems.value.slice(start, start + pageSize);
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
