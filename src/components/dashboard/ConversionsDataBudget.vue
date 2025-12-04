<script setup>
import { ref } from 'vue';
import Dropdown from '../filter/Dropdown.vue';

const conversions = ref([
  { name: "Gns konverteringer", data: "120", description: "(+) Stabil" },
  { name: "Gns CarBoost andel", data: "53", description: "44,17% af totalen" },
  { name: "Gns Pris pr. bil pr. dag", data: "3,19 kr.", description: "(lav - høj effektivitet)"},
  { name: "Gns antal biler", data: "69", description: "--"}
]);

const segmentOptions = [
  "0 - 1000 kr.",
  "1001 - 2000 kr.",
  "2001 - 3000 kr.",
  "3001 - 4000 kr.",
  "4001 - 5001 kr."
];

const selectedSegment = ref(segmentOptions[0]);
</script>
<template>
    <div class="conversion-data-budget">
        <h1 class="conversion-data-budget__title">Konverteringsdata budget</h1>
        <Dropdown
            v-model="selectedSegment"
            :options="segmentOptions"
            label="Segment"
        >
        </Dropdown>  
        <div class="conversion-data-budget__content">
            <div v-for="(conversion, index) in conversions" :key="index" class="conversion-data-budget__content__box">
                <div class="conversion-data-budget__content__box-name h3">{{ conversion.name }}</div>
                <div class="conversion-data-budget__content__box-data h1">{{ conversion.data }}</div>
                <div class="conversion-data-budget__content__box-description">{{ conversion.description }}</div>
            </div>
        </div>
    </div>
</template>