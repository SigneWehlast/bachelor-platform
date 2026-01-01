<script setup>
import { ref, watch, onMounted } from 'vue';
import ApexCharts from 'apexcharts';

//Service
import { getHistoryCarboost } from '@/services/historyService';

const props = defineProps({
  selectedIds: {
    type: Array,
    default: () => []
  },
  selectedMonth: {
    type: String,
    default: null
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
  history.value = result.history || [];
});

watch([history, () => props.selectedIds, () => props.selectedMonth], ([newHistory, ids, month]) => {
  if (!newHistory.length || !ids.length) {
    if (chart) chart.destroy();
    return;
  }

  const [year, monthNum] = month ? month.split('-').map(Number) : [null, null];

  const filteredHistory = newHistory
    .filter(h => ids.includes(h.id))
    .filter(h => {
      if (!year || !monthNum) return true;
      const d = new Date(h.archived_at);
      return d.getFullYear() === year && (d.getMonth() + 1) === monthNum;
    })
    .sort((a, b) => new Date(a.archived_at) - new Date(b.archived_at));

  if (!filteredHistory.length) {
    if (chart) chart.destroy();
    return;
  }

  const allDates = Array.from(
    new Set(filteredHistory.map(h => new Date(h.archived_at).toLocaleDateString('da-DK')))
  ).sort((a,b) => new Date(a) - new Date(b));

  const series = ids.map(id => {
    const points = filteredHistory.filter(h => h.id === id);
    const customer = props.customers.find(c => c.id === id);
    const name = points.length ? points[0].name : (customer ? customer.name : `Navn ${id}`);

    const data = allDates.map(date => {
      const point = points.find(p => new Date(p.archived_at).toLocaleDateString('da-DK') === date);
      return point ? point.dif_leads : 0;
    });

    return { name, data };
  });

  const options = {
    chart: { type: 'line', height: 350, toolbar: { show: true }, zoom: { enabled: false } },
    series,
    stroke: { curve: 'smooth' },
    xaxis: { categories: allDates },
    legend: { horizontalAlign: 'left', showForSingleSeries: true }
  };

  if (chart) chart.destroy();
  chart = new ApexCharts(document.querySelector('#chart'), options);
  chart.render();
});
</script>
  <template>
    <div class='carboost-graph'>
      <div id='chart'></div>
    </div>
  </template>