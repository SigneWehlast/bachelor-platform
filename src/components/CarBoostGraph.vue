<script setup>
import { ref, watch, onMounted } from "vue";
import ApexCharts from "apexcharts";
import { getHistoryCarboost } from "@/config/historyService";

const props = defineProps({
  selectedIds: {
    type: Array,
    default: () => []
  },
  customers: {
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

  const filteredHistory = newHistory
    .filter(item => ids.includes(item.id))
    .sort((a, b) => new Date(a.archived_at) - new Date(b.archived_at));

  const allDates = Array.from(
    new Set(filteredHistory.map(item => new Date(item.archived_at).toLocaleDateString("da-DK")))
  );

  const series = ids.map(id => {
    const points = filteredHistory.filter(item => item.id === id);
    const customer = props.customers.find(c => c.id === id);
    
    // Bevarer navnet fra historikken, hvis det findes
    const name = points.length ? points[0].name : (customer ? customer.name : `Navn ${id}`);
    
    const data = allDates.map(date => {
      const point = points.find(p => new Date(p.archived_at).toLocaleDateString("da-DK") === date);
      return point ? point.leads : 0;
    });

    return { name, data };
  });

  const options = {
    chart: { type: "line", height: 350, toolbar: { show: true }, zoom: { enabled: false } },
    series,
    stroke: {
    curve: 'smooth'
  },
    xaxis: { categories: allDates },
    legend: { horizontalAlign: "left", showForSingleSeries: true }
  };

  if (chart) chart.destroy();
  chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
});
</script>

<template>
  <div class="Carboost-graph">
    <div id="chart"></div>
  </div>
</template>
