<script setup>
import { ref } from 'vue';
import Icon from "@/components/Icon.vue"

const conversionsCars = ref([
  { name: "Gns konverteringer", data: "2", description: "(+) Stabil" },
  { name: "Gns CarBoost konverteringer", data: "50", description: "47,97% af totalen" },
  { name: "Gns Pris pr. bil pr. dag", data: "3,19 kr.", description: "(lav - god økonomi)"},
  { name: "Gns antal biler", data: "87", description: "--"}
]);

const segmentOptions = [
  "0 - 25 biler",
  "26-50 biler",
  "51-75 biler",
  "76-100 biler",
  "101-125 biler",
  "126-150 biler",
  "151-175 biler",
  "176-200 biler",
  "200+ biler"
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
    <div class="conversion-data-cars">
        <h1 class="conversion-data-cars__title">Konverteringsdata biler</h1>
        <div class="conversion-data-cars__dropdown" @click="toggleDropdown">
            <p class="text-regular">Segment: {{ selectedSegment }}</p>
            <Icon
                :name="dropdownOpen ? 'ChevronDoubleUp': 'ChevronDoubleDown'"
                class="conversion-data-cars__dropdown-icon"
            />
        
            <ul v-if="dropdownOpen" class="conversion-data-cars__dropdown-options">
                <li
                    v-for="(option, index) in segmentOptions"
                    :key="index"
                    class="conversion-data-cars__dropdown-item"
                    @click.stop="selectSegment(option)"
                >
                    {{ option }}
                </li>
            </ul>
        </div>        
        <div class="conversion-data-cars__content">
            <div v-for="(conversion, index) in conversionsCars" :key="index" class="conversion-data-cars__content__box">
                <div class="conversion-data-cars__content__box-name h3">{{ conversion.name }}</div>
                <div class="conversion-data-cars__content__box-data h1">{{ conversion.data }}</div>
                <div class="conversion-data-cars__content__box-description">{{ conversion.description }}</div>
            </div>
        </div>
    </div>
</template>