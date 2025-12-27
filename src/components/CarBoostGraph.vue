<script setup>
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
  import ApexCharts from 'apexcharts'
  import { getHistoryCarboost } from '@/services/historyService'
  
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
  })
  
  const history = ref([])
  let chart = null
  
  onMounted(async () => {
    const result = await getHistoryCarboost()
    history.value = result.history || []
  })
  
  onBeforeUnmount(() => {
    if (chart) chart.destroy()
  })
  
  watch(
    [history, () => props.selectedIds, () => props.selectedMonth, () => props.customers],
    ([newHistory, ids, month]) => {
      if (!newHistory.length || !ids.length) return
  
      const [year, monthNum] = month
        ? month.split('-').map(Number)
        : [null, null]
  
      const filteredHistory = newHistory
        .filter(h => ids.includes(h.id))
        .filter(h => {
          if (!year || !monthNum) return true
          const d = new Date(h.archived_at)
          return (
            d.getFullYear() === year &&
            d.getMonth() + 1 === monthNum
          )
        })
        .sort(
          (a, b) =>
            new Date(a.archived_at) - new Date(b.archived_at)
        )
  
      if (!filteredHistory.length) return
  
      const allDates = [
        ...new Set(
          filteredHistory.map(h =>
            new Date(h.archived_at).toLocaleDateString('da-DK')
          )
        )
      ]
  
      const series = ids.map(id => {
        const points = filteredHistory.filter(h => h.id === id)
        const customer = props.customers.find(c => c.id === id)
  
        return {
          name: customer?.name || points[0]?.name || `Navn ${id}`,
          data: allDates.map(date => {
            const p = points.find(
              h =>
                new Date(h.archived_at).toLocaleDateString('da-DK') === date
            )
            return p ? p.dif_leads : 0
          })
        }
      })
  
      const options = {
        chart: {
          type: 'line',
          height: 350,
          toolbar: { show: true },
          zoom: { enabled: false }
        },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: { categories: allDates },
        legend: {
          show: true,
          showForSingleSeries: false
        }
      }
  
      if (!chart) {
        chart = new ApexCharts(
          document.querySelector('#chart'),
          { ...options, series }
        )
        chart.render()
      } else {
        chart.updateOptions(
          { ...options, series },
          true,
          true
        )
      }
    },
    { immediate: true }
  )
  </script>
  
  <template>
    <div class="carboost-graph">
      <div id="chart"></div>
    </div>
  </template>  