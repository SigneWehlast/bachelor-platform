<script setup>
    import { ref, onMounted, watch } from "vue";
    import Dropdown from "../filter/Dropdown.vue";
    import { getCustomers } from "@/config/customerService";
    
    // Data til visning
    const conversionsCars = ref([
      { name: "Gns konverteringer", data: "-", description: "" },
      { name: "Gns CarBoost konverteringer", data: "-", description: "" },
      { name: "Gns Pris pr. bil pr. dag", data: "-", description: "" },
      { name: "Gns antal biler", data: "-", description: "" }
    ]);
    
    // Segment options
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
    
    // Data fra API
    const customers = ref([]);
    
    // ------ SEGMENT PARSER ------
    function segmentRange(segment) {
      const trimmed = (segment || "").toString().trim();
      if (trimmed.includes("+")) return { min: 200, max: 9999 };
    
      const parts = trimmed.replace(" biler", "").split("-");
      if (parts.length !== 2) return { min: 0, max: 9999 }; // fallback
    
      const min = Number(parts[0].trim());
      const max = Number(parts[1].trim());
      return { min, max };
    }
    
    // ------ FILTER ------
    function filterBySegment() {
      const { min, max } = segmentRange(selectedSegment.value);
      const filtered = customers.value.filter(c => c.numberOfCars >= min && c.numberOfCars <= max);
    
      // Debug log
      console.log("Selected segment:", selectedSegment.value);
      console.log("Segment range:", min, max);
      console.log("Filtered customers:", filtered);
    
      return filtered;
    }
    
    // ------ CALCULATE AVERAGES ------
    function calculateAverages() {
      const list = filterBySegment();
    
      if (list.length === 0) {
        conversionsCars.value[0].data = "0";
        conversionsCars.value[1].data = "0";
        conversionsCars.value[2].data = "0 kr.";
        conversionsCars.value[3].data = "0";
        return;
      }
    
      const totalConversions = list.reduce((sum, c) => sum + c.carboostConversions, 0);
      const totalLeads = list.reduce((sum, c) => sum + c.leads, 0);
      const totalCars = list.reduce((sum, c) => sum + c.numberOfCars, 0);
      const totalBudget = list.reduce((sum, c) => sum + c.totalBudget, 0);
    
      conversionsCars.value[0].data = (totalConversions / list.length).toFixed(1);
      conversionsCars.value[1].data = (totalLeads / list.length).toFixed(1);
      conversionsCars.value[2].data = (totalBudget / (totalCars * 30)).toFixed(2) + " kr.";
      conversionsCars.value[3].data = Math.round(totalCars / list.length);
    }
    
    // ------ FETCH DATA ------
onMounted(async () => {
  const raw = await getCustomers();

  // Brug allerede eksisterende fields
  customers.value = raw.map(c => ({
    ...c,
    numberOfCars: Number(c.numberOfCars) || 0,
    totalBudget: Number(c.total_budget) || 0,
    leads: Number(c.leads) || 0,
    carboostConversions: Number(c.carboost_conversions) || 0
  }));

  console.log("Processed customers:", customers.value);

  calculateAverages();
});
    
    // Beregn igen når segment skiftes
    watch(selectedSegment, calculateAverages);
    </script>
    
<template>
    <div class="conversion-data-cars">
        <h1 class="conversion-data-cars__title">Konverteringsdata biler</h1>
        <Dropdown
            v-model="selectedSegment"
            :options="segmentOptions"
            label="Segment"
        >
        </Dropdown>     
        <div class="conversion-data-cars__content">
            <div v-for="(conversion, index) in conversionsCars" :key="index" class="conversion-data-cars__content__box">
                <div class="conversion-data-cars__content__box-name h3">{{ conversion.name }}</div>
                <div class="conversion-data-cars__content__box-data h1">{{ conversion.data }}</div>
                <div class="conversion-data-cars__content__box-description">{{ conversion.description }}</div>
            </div>
        </div>
    </div>
</template>