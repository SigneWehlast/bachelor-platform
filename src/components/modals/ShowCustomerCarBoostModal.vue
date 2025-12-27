<script setup>
import { defineProps, defineEmits, ref, watch, onMounted, computed } from 'vue';
import Icon from '@/components/Icon.vue';
import CalendarComp from '../filter/CalendarComp.vue';
import ExportData from '../filter/ExportData.vue';
import ApexCharts from 'apexcharts';
import CarBoostTable from '../CarBoostTable.vue';
import { getHistoryCarboost } from '@/services/historyService';
import CarBoostGraph from '../CarBoostGraph.vue';

const props = defineProps({
  customer: { type: Object, default: null }
});

const emit = defineEmits(['close']);
function handleClose() {
  emit('close');
};

const today = new Date();
const selectedMonth = ref(`${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2,'0')}`);

const history = ref([]);
const customerData = ref([]);
let chart = null;

const fetchCustomerData = () => {
  if (!props.customer || !history.value.length) return;

  const [year, monthNum] = selectedMonth.value.split('-').map(Number);

  const customerHistory = history.value
    .filter(h => h.id === props.customer.id)
    .sort((a,b) => new Date(a.archived_at) - new Date(b.archived_at));

  // Find sidste dag i den valgte måned
  const currentMonthHistory = customerHistory
    .filter(h => {
      const d = new Date(h.archived_at);
      return d.getFullYear() === year && (d.getMonth() + 1) === monthNum;
    });

  if (!currentMonthHistory.length) {
    customerData.value = [];
    if(chart) chart.destroy();
    return;
  }

  const lastDayCurrent = currentMonthHistory[currentMonthHistory.length - 1];

  // Find sidste dag i forrige måned
  const prevMonth = monthNum === 1 ? 12 : monthNum - 1;
  const prevYear = monthNum === 1 ? year - 1 : year;

  const prevMonthHistory = customerHistory
    .filter(h => {
      const d = new Date(h.archived_at);
      return d.getFullYear() === prevYear && (d.getMonth() + 1) === prevMonth;
    });

  const lastDayPrev = prevMonthHistory.length
    ? prevMonthHistory[prevMonthHistory.length - 1]
    : { leads: 0 };

  // Beregn måned-til-måned ændring
  const monthChange = lastDayCurrent.leads - lastDayPrev.leads;

  customerData.value = [{
    id: props.customer.id,
    name: props.customer.name,
    leads: lastDayCurrent.leads,
    change: monthChange,
    tendens: monthChange > 0 ? 'up' : monthChange < 0 ? 'down' : '-',
    period: new Date(selectedMonth.value + '-01').toLocaleDateString('da-DK', { month: 'long', year: 'numeric' }),
    last_updated: lastDayCurrent.archived_at
  }];

  const dates = currentMonthHistory.map(p => new Date(p.archived_at).toLocaleDateString('da-DK'));
  const data = currentMonthHistory.map(p => p.dif_leads);

  if(chart) chart.destroy();
  chart = new ApexCharts(document.querySelector('#chart'), {
    chart: { type: 'line', height: 350, toolbar: { show: true }, zoom: { enabled: false } },
    series: [{ name: props.customer.name, data }],
    stroke: { curve: 'smooth' },
    xaxis: { categories: dates },
    legend: { show: false }
  });
  chart.render();
};

const tendensDown = computed(() => props.customer?.tendens === 'down');

onMounted(async () => {
  const result = await getHistoryCarboost();
  history.value = result.history || [];
});

watch(
  [selectedMonth, () => props.customer, history],
  ([customer, hist]) => {
    if(hist.length && customer) fetchCustomerData();
  },
  { immediate: true }
);
</script>
<template>
  <div class='show-customer-carboost-modal'>
    <div class='show-customer-carboost-modal__content'>
        <div>
          <div class='show-customer-carboost-modal__topbar'>
              <Icon @click='handleClose' name='Close' class='show-customer-carboost-modal__topbar-icon' />
              <h1 class='show-customer-carboost-modal__topbar-title'>{{ customer?.name }}</h1>
          </div>
          <div class='show-customer-carboost-modal__topbar-dropdowns'>
              <CalendarComp v-model='selectedMonth' :hide-day-option='true' />
              <ExportData />
          </div>
          <div v-if='tendensDown' class='show-customer-carboost-modal__topbar-alert'>
              <Icon name='Alert' class='show-customer-carboost-modal__topbar-alert__icon' />
              <p class='text-regular show-customer-carboost-modal__topbar-alert__text'>OBS. tendens er faldende</p>
          </div>
        </div>
        <CarBoostGraph
          :selectedIds="[customer?.id]"
          :selectedMonth="selectedMonth"
          :customers="[customer]"
          :history="history"
        />
        <p class='text-regular show-customer-carboost-modal__last-updated'>
          Sidst opdateret: {{ customerData[0]?.last_updated ? new Date(customerData[0].last_updated).toLocaleDateString('da-DK') : '-' }}
        </p>
        <CarBoostTable
          :highlighted-ids='[customer?.id]'
          :show-only-selected='true'
          :hide-pagination='true'
          :hide-checkbox='true'
          :table-in-modal='true'
          :visible-columns="['change', 'lastUpdated', 'tendens', 'period']"
          :selected-month='selectedMonth'
        />
    </div>
  </div>
</template>
