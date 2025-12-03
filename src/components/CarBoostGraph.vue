<script setup>
import { ref, onMounted, watch } from "vue";
import { getHistoryCarboost } from "@/config/historyService";
import ApexCharts from "apexcharts";

const history = ref([]);
const totalCount = ref(0);
const selectedId = ref(8);
let chart = null;

// Hent historikdata
onMounted(async () => {
  const result = await getHistoryCarboost();
  history.value = result.history;
  totalCount.value = result.totalCount;
});

// Watch history og opret chart når data er klar
watch([history, selectedId], ([newHistory, id]) => {
  if (newHistory.length === 0) return;

  const filtered = newHistory.filter(item => item.id === id);
  if (filtered.length === 0) return;

  const categories = filtered.map(item => {
    const date = new Date(item.archived_at);
    const day = date.getDate();
    const month = date.toLocaleString('da-DK', { month: 'short' });
    return `${day}.${month}`;
  });

  const data = filtered.map(item => item.leads);

  const options = {
    chart: { type: "line", height: 350 },
    series: [{ name: "Leads", data }],
    xaxis: { categories },
  };

  if (chart) chart.destroy();
  chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
});

</script>

<template>
  <div>
    <h2>Carboost Historik</h2>

    <label>
      Vælg ID: 
      <input type="number" v-model="selectedId" min="1" />
    </label>

    <ul>
      <li v-for="item in history.filter(i => i.id === selectedId)" :key="item.id">
        ID: {{ item.id }} | Leads: {{ item.leads }} | Arkiveret: {{ item.archived_at }}
      </li>
    </ul>
  </div>

  <div id="chart"></div>

</template>
