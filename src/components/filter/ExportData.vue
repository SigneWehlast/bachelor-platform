<script setup>
//Components
import Dropdown from './Dropdown.vue';

const exportOptions = ['Eksporter som CSV'];

const props = defineProps({
  tableData: {
    type: Array,
    required: true
  },
  visibleColumns: {
    type: Array,
    required: true
  },
  showId: {
    type: Boolean,
    default: false
  }
});

function exportCSV() {
  const data = props.tableData?.value || props.tableData;
  if (!data || !data.length) return;

  const csvData = data.map(row => {
    const mappedRow = {};
    props.visibleColumns.forEach(col => {
      if (col === 'name') mappedRow['Kundenavn'] = row.name;
      if (col === 'numberOfCars') mappedRow['Antal biler'] = row.numberOfCars;
      if (col === 'totalBudget') mappedRow['Samlet Budget'] = row.totalBudget;
      if (col === 'conversions') mappedRow['Konverteringer'] = row.leads;
      if (col === 'saleConversions') mappedRow['Sale konverteringer'] = row.saleConversions;
      if (col === 'budget') mappedRow['Budget pr dag'] = row.budgetPerDay;
      if (col === 'conversionsPercent') mappedRow['Konvertering i procent'] = row.conversionPercent;
      if (props.showId) mappedRow['ID'] = row.id;
    });
    return mappedRow;
  });

  const headers = Object.keys(csvData[0]).join(',');
  const rows = csvData.map(r => Object.values(r).join(',')).join('\n');
  const csvContent = headers + '\n' + rows;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SalesTabel.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function handleSelect(option) {
  if (option === 'Eksporter som CSV') {
    exportCSV();
  }
}
</script>

<template>
  <Dropdown
    :options="exportOptions"
    label="Eksporter"
    @select="handleSelect"
  />
</template>