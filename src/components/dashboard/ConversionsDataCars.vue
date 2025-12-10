<script setup>
    import { ref, onMounted, watch } from "vue";
    import Dropdown from "../filter/Dropdown.vue";
    import { getCustomerStats } from "@/config/customerStatsService";
    
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
    
    // Valgt segment
    const selectedSegment = ref(segmentOptions[0]);
    
    // State til data fra API
    const customerData = ref([]);
    
    // Funktion til at parse segmenttekst til min/max værdier
    function parseSegment(segment) {
      if (segment === "200+ biler") return { min: 201, max: Infinity };
      const [min, max] = segment.split("-").map(s => parseInt(s.trim()));
      return { min, max };
    }
    
    // Funktion til at opdatere konverteringsdata baseret på segment
    function updateConversions() {
      const { min, max } = parseSegment(selectedSegment.value);
      const filtered = customerData.value.filter(c => c.numberOfCars >= min && c.numberOfCars <= max);
    
      if (filtered.length === 0) {
        conversionsCars.value = conversionsCars.value.map(c => ({ ...c, data: "0" }));
        return;
      }
    
      const totalLeads = filtered.reduce((acc, c) => acc + c.leads, 0);
      const totalCarBoost = filtered.reduce((acc, c) => acc + c.carboostConversions, 0);
      const totalCars = filtered.reduce((acc, c) => acc + c.numberOfCars, 0);
      const totalBudget = filtered.reduce((acc, c) => acc + c.totalBudget, 0);
    
      conversionsCars.value = [
        { name: "Gns konverteringer", data: (totalLeads / filtered.length).toFixed(0), description: "" },
        { name: "Gns CarBoost konverteringer", data: (totalCarBoost / filtered.length).toFixed(2), description: "" },
        { name: "Gns Pris pr. bil pr. dag", data: totalCars ? (totalBudget / (totalCars *30)).toFixed(1) : "0", description: "" },
        { name: "Gns antal biler", data: (totalCars / filtered.length).toFixed(0), description: "" }
      ];
    }
    
    // Hent data når komponenten mountes
    onMounted(async () => {
      try {
        const data = await getCustomerStats();
        customerData.value = data;
        updateConversions();
      } catch (err) {
        console.error("Fejl ved hentning af stats:", err);
      }
    });
    
    // Watcher på selectedSegment så data opdateres når dropdown ændres
    watch(selectedSegment, () => {
      updateConversions();
    });
    </script>
    
    
    <template>
      <div class="conversion-data-cars">
        <h1 class="conversion-data-cars__title">Konverteringsdata biler</h1>
        <Dropdown
          v-model="selectedSegment"
          :options="segmentOptions"
          label="Segment"
        />
        <div class="conversion-data-cars__content">
          <div
            v-for="(conversion, index) in conversionsCars"
            :key="index"
            class="conversion-data-cars__content__box"
          >
            <div class="conversion-data-cars__content__box-name h3">{{ conversion.name }}</div>
            <div class="conversion-data-cars__content__box-data h1">{{ conversion.data }}</div>
            <div class="conversion-data-cars__content__box-description">{{ conversion.description }}</div>
          </div>
        </div>
      </div>
    </template>
    