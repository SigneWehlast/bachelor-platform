<script setup>
import BaseTable from './BaseTable.vue';

const props = defineProps({
  carsData: {
    type: Array,
    required: true
  },
  showId: {
    type: Boolean,
    required: true
  },
  visibleColumns: {
    type: Array,
    required: true
  },
  selectedMonth: {
    type: String,
    default: null
  }
});
</script>
<template>
  <div>
    <BaseTable>
      <template #header>
        <th class='sale-table__text--leftalign sale-table-title-name'>{{ props.showId ? 'ID' : 'Kundenavn' }}</th>
        <th class='sale-table-title'>Antal biler</th>
        <th class='sale-table-title' v-if='props.visibleColumns.includes("totalBudget")'>Samlet Budget</th>
        <th class='sale-table-title' v-if='props.visibleColumns.includes("conversions")'>Konverteringer</th>
        <th class='sale-table-title' v-if='props.visibleColumns.includes("saleConversions")'>sale konverteringer</th>
        <th class='sale-table-title' v-if='props.visibleColumns.includes("budget")'>Budget pr dag</th>
        <th v-if='props.visibleColumns.includes("conversionsPercent")' class='sale-table__text--leftalign sale-table-title'>Konvertering i procent</th>
      </template>

      <template #rows>
        <tr v-for='item in props.carsData' :key='item.customer_id'>
          <td  class='sale-table__text--leftalign'>{{ showId ? item.id : item.name }}</td>
          <td class='sale-table__text--center'>{{ item.numberOfCars }}</td>
          <td v-if='props.visibleColumns.includes("totalBudget")' class='sale-table__text--center'>{{ item.totalBudget }}kr</td>
          <td v-if='props.visibleColumns.includes("conversions")' class='sale-table__text--center'>{{ item.leads }}</td>
          <td v-if='props.visibleColumns.includes("saleConversions")' class='sale-table__text--center'>{{ item.saleConversions }}</td>
          <td v-if='props.visibleColumns.includes("budget")' class='sale-table__text--center'>{{ item.budgetPerDay }}kr</td>
          <td v-if='props.visibleColumns.includes("conversionsPercent")' class='sale-table__text--center'>{{ item.conversionPercent }}%</td>
        </tr>
      </template>
    </BaseTable>
  </div>
</template>
