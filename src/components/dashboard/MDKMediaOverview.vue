<script setup>
import { ref, onMounted, computed } from 'vue';
import { getCustomersInGroups } from '@/services/groupOverviewService';
import { useCarboostWarnings } from '@/utils/CarboostWarnings.js';
import { getCustomersInCarboost } from '@/services/carboostService';

const overviews = ref([]);

const { setCustomers, warningCustomers } = useCarboostWarnings();

const combinedOverview = computed(() => {
  const warningBox = {
    name: 'Advarsler',
    data: warningCustomers.value.length
  };

  return [warningBox, ...overviews.value];
});

onMounted(async () => {
  const data = await getCustomersInGroups();
  overviews.value = data.map(item => ({
    name: item.groupName,
    data: item.customerCount
  }));

  const carboostData = await getCustomersInCarboost(1, 99999);
  setCustomers(carboostData.customers || []);
});
</script>

<template>
  <div class="mdkmedia-overview">
    <h1 class="mdkmedia-overview__title">MDK-Media Oversigt</h1>
    <div class="mdkmedia-overview__content">
      <div
        v-for="(overview, index) in combinedOverview"
        :key="index"
        class="mdkmedia-overview__content__box"
      >
        <div class="mdkmedia-overview__content__box-name h3">{{ overview.name }}</div>
        <div class="mdkmedia-overview__content__box-data h1">{{ overview.data }}</div>
      </div>
    </div>
  </div>
</template>
