<script setup>
import { defineProps, defineEmits, ref, watch, onMounted,computed } from "vue";
import Icon from "@/components/Icon.vue";
import CalendarComp from "../filter/CalendarComp.vue";
import ExportData from "../filter/ExportData.vue";
import ApexCharts from "apexcharts";
import { getHistoryCarboost } from "@/config/historyService";
import CarBoostTable from "../CarBoostTable.vue";

const props = defineProps({
  customer: { type: Object, default: null }
});

const emit = defineEmits(["close"]);
function handleClose() { emit("close"); }

const history = ref([]);
let chart = null;

onMounted(async () => {
  const result = await getHistoryCarboost();
  history.value = result.history;
});

watch([history, () => props.customer], ([newHistory, customer]) => {
  
  if (!newHistory.length || !customer) {
    if (chart) chart.destroy();
    return;
  }

  const points = newHistory
    .filter(h => h.id === customer.id)
    .sort((a, b) => new Date(a.archived_at) - new Date(b.archived_at));

  if (!points.length) {
    if (chart) chart.destroy();
    return;
  }

  const dates = points.map(
    p => new Date(p.archived_at).toLocaleDateString("da-DK")
  );

  const data = points.map(p => p.dif_leads);

  const series = [
    {
      name: customer.name,
      data
    }
  ];

  const options = {
    chart: { type: "line", height: 350, toolbar: { show: true } },
    series,
    stroke: { curve: "smooth" },
    xaxis: { categories: dates },
    legend: { show: false }
  };

  if (chart) chart.destroy();

  chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
});

const tendensDown = computed(() => props.customer?.tendens === 'down');

const lastUpdated = computed(() => {
  if (!props.customer || !history.value.length) return "-";

  const points = history.value
    .filter(h => h.id === props.customer.id)
    .sort((a, b) => new Date(b.archived_at) - new Date(a.archived_at));

  if (!points.length) return "-";

  return new Date(points[0].archived_at).toLocaleDateString("da-DK");
});


</script>
<template>
  <div class="show-customer-carboost-modal">
    <div class="show-customer-carboost-modal__content">
        <div>
            <div class="show-customer-carboost-modal__topbar">
                <Icon @click="handleClose" name="Close" class="show-customer-carboost-modal__topbar-icon" />
                <h1 class="show-customer-carboost-modal__topbar-title">{{ customer?.name }}</h1>
            </div>
            <div class="show-customer-carboost-modal__topbar-dropdowns">
                <CalendarComp />
                <ExportData />
            </div>
            <div v-if="tendensDown" class="show-customer-carboost-modal__topbar-alert">
                <Icon name="Alert" class="show-customer-carboost-modal__topbar-alert__icon" />
                <p class="text-regular show-customer-carboost-modal__topbar-alert__text">OBS. tendens er faldende</p>
            </div>
        </div>
        <div class="carboost-graph" id="chart"></div>
        <p class="text-regular show-customer-carboost-modal__last-updated">
            Sidst opdateret: {{ lastUpdated }}
        </p>
        <CarBoostTable 
          :highlighted-ids="[customer?.id]"
          :show-only-selected="true"
          :hide-pagination="true"
          :hide-checkbox="true"
          :table-in-modal="true"
        />
    </div>
  </div>
</template>
