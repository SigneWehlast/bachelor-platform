<script setup>
import { ref } from 'vue';
const conversions = ref([
  { name: "Gns konverteringer", data: "120", description: "(+) Stabil" },
  { name: "Gns CarBoost andel", data: "53", description: "44,17% af totalen" },
  { name: "Gns Pris pr. bil pr. dag", data: "3,19 kr.", description: "(lav - høj effektivitet)"},
  { name: "Gns antal biler", data: "69", description: "--"}
]);
</script>
<template>
    <div class="conversion-data-budget">
        <h1 class="conversion-data-budget__title">Konverteringsdata budget</h1>
        <div>Segment: 4001 - 5001 kr.</div>
        <div class="conversion-data-budget__content">
            <div v-for="(conversion, index) in conversions" :key="index" class="conversion-data-budget__content__box">
                <div class="conversion-data-budget__content__box-name h3">{{ conversion.name }}</div>
                <div class="conversion-data-budget__content__box-data h1">{{ conversion.data }}</div>
                <div class="conversion-data-budget__content__box-description">{{ conversion.description }}</div>
            </div>
        </div>
    </div>
</template>