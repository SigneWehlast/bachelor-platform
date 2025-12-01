<template>
    <div>
      <!-- Toggle mellem navn og id -->
      <label>
        <input type="checkbox" v-model="showId" /> Vis ID i stedet for navn
      </label>
  
      <BaseTable>
        <template #header>
          <th>{{ showId ? 'ID' : 'Kundenavn' }}</th>
          <th>Antal biler</th>
          <th>Samlet Budget</th>
          <th>Konverteringer</th>
          <th>Carboost konverteringer</th>
          <th>Budget pr dag</th>
          <th>Konvertering %</th>
        </template>
  
        <template #rows>
          <tr v-for="item in carsData" :key="item.id">
            <!-- Dynamisk visning: name eller id -->
            <td>{{ showId ? item.id : item.name }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.budget }}</td>
            <td>{{ item.conversions }}</td>
            <td>{{ item.carboostConversions }}</td>
            <td>{{ item.dailyBudget }}</td>
            <td>{{ item.conversionPercent }}%</td>
          </tr>
        </template>
      </BaseTable>
    </div>
  </template>
  
  <script>
  import BaseTable from './BaseTable.vue';
  
  export default {
    name: 'SalesTable',
    components: { BaseTable },
  };
  </script>
  