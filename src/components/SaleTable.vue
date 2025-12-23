<script setup>
import BaseTable from './BaseTable.vue';
import Tooltip from './Tooltip.vue';

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
        <th class="sale-table__text--leftalign sale-table-title-name">{{ props.showId ? 'ID' : 'Kundenavn' }}</th>
        <th class="sale-table-title"><div class="sale-table__tooltip">Antal biler<Tooltip type="antal-biler"/></div></th> 
        <th class="sale-table-title" v-if="props.visibleColumns.includes('totalBudget')"><div class="sale-table__tooltip">Samlet Budget<Tooltip type="totalBudget"/></div></th>
        <th class="sale-table-title" v-if="props.visibleColumns.includes('conversions')"><div class="sale-table__tooltip">Konverteringer<Tooltip type="conversions"/></div></th>
        <th class="sale-table-title" v-if="props.visibleColumns.includes('saleConversions')"><div class="sale-table__tooltip">sale konverteringer<Tooltip type="saleConversions"/></div></th>
        <th class="sale-table-title" v-if="props.visibleColumns.includes('budget')"><div class="sale-table__tooltip">Budget pr dag<Tooltip type="budgetPerDay"/></div></th>
        <th v-if="props.visibleColumns.includes('conversionsPercent')" class="sale-table__text--leftalign sale-table-title"><div class="sale-table__tooltip">Konvertering i procent<Tooltip type="conversionsPercent"/></div></th>
      </template>

      <template #rows>
        <tr v-for="item in props.carsData" :key="item.customer_id">
          <td  class="sale-table__text--leftalign">{{ showId ? item.id : item.name }}</td>
          <td class="sale-table__text--center">{{ item.numberOfCars }}</td>
          <td v-if="props.visibleColumns.includes('totalBudget')" class="sale-table__text--center">{{ item.totalBudget }}kr</td>
          <td v-if="props.visibleColumns.includes('conversions')" class="sale-table__text--center">{{ item.leads }}</td>
          <td v-if="props.visibleColumns.includes('saleConversions')" class="sale-table__text--center">{{ item.saleConversions }}</td>
          <td v-if="props.visibleColumns.includes('budget')" class="sale-table__text--center">{{ item.budgetPerDay }}kr</td> 
          <td v-if="props.visibleColumns.includes('conversionsPercent')" class="sale-table__text--center">{{ item.conversionPercent }}%</td>
        </tr>
      </template>
    </BaseTable>
  </div>
</template>
