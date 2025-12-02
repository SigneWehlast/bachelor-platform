<script setup>
import { ref } from 'vue';
import Icon from "@/components/Icon.vue"

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
const dropdownOpen = ref(false);

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function selectSegment(option) {
  selectedSegment.value = option;
  dropdownOpen.value = false;
}
</script>
<template>
    <div class="conversion-data-budget">
        <h1 class="conversion-data-budget__title">Konverteringsdata budget</h1>
        <div class="conversion-data-budget__dropdown" @click="toggleDropdown">
            <p class="text-regular">Segment: {{ selectedSegment }}</p>
            <Icon
                :name="dropdownOpen ? 'ChevronDoubleUp': 'ChevronDoubleDown'"
                class="conversion-data-budget__dropdown-icon"
            />
        
            <ul v-if="dropdownOpen" class="conversion-data-budget__dropdown-options">
                <li
                    v-for="(option, index) in segmentOptions"
                    :key="index"
                    class="conversion-data-budget__dropdown-item"
                    @click.stop="selectSegment(option)"
                >
                    {{ option }}
                </li>
            </ul>
        </div>
        <div class="conversion-data-budget__content">
            <div v-for="(conversion, index) in conversions" :key="index" class="conversion-data-budget__content__box">
                <div class="conversion-data-budget__content__box-name h3">{{ conversion.name }}</div>
                <div class="conversion-data-budget__content__box-data h1">{{ conversion.data }}</div>
                <div class="conversion-data-budget__content__box-description">{{ conversion.description }}</div>
            </div>
        </div>
    </div>
</template>