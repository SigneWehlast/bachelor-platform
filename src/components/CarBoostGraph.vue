<script setup>
import { ref, watch, onMounted } from "vue";
import ApexCharts from "apexcharts";
import { getHistoryCarboost } from "@/config/historyService";

const props = defineProps({
  selectedIds: {
    type: Array,
    default: () => []
  },
  customers: { // tilføj denne prop så vi kan slå navn op
    type: Array,
    default: () => []
  }
});

const history = ref([]);
let chart = null;

onMounted(async () => {
  const result = await getHistoryCarboost();
  history.value = result.history;
});

// Watch både history og selectedIds
watch([history, () => props.selectedIds], ([newHistory, ids]) => {
  if (!newHistory.length || !ids.length) {
    if (chart) chart.destroy();
    return;
  }

  const series = ids.map(id => {
    const filtered = newHistory.filter(item => item.id === id);

    // Find navnet fra props.customers
    const customer = props.customers.find(c => c.id === id);
    const name = filtered.length ? filtered[0].name : `Navn ${id}`;

    return {
      name, // vis navnet i stedet for ID
      data: filtered.map(item => item.leads)
    };
  });

  // X-aksen: unikke datoer for alle valgte ID'er
  const allDates = Array.from(new Set(
    newHistory
      .filter(item => ids.includes(item.id))
      .map(item => new Date(item.archived_at).toLocaleDateString("da-DK"))
  )).sort((a,b) => new Date(a) - new Date(b));

  const options = {
    chart: { type: "line", height: 350 },
    series,
    xaxis: { categories: allDates },
  };

  if (chart) chart.destroy();
  chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
});
</script>

<template>
  <div id="chart"></div>
</template>
