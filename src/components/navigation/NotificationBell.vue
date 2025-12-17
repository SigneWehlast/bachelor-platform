<script setup>
    import { onMounted } from "vue";
    import Icon from "@/components/Icon.vue";
    import { useCarboostWarnings } from "@/utils/CarboostWarnings.js";
    import { getCustomersInCarboost } from "@/services/carboostService";
    
    const {
      setCustomers,
      hasWarnings,
      warningCount
    } = useCarboostWarnings();
    
    onMounted(async () => {
      const response = await getCustomersInCarboost(1, 99999);
      setCustomers(response.customers || []);
    });
    </script>
    
    
    <template>
<div class="notificationBell">
    <p>test igen</p>
  <Icon
    name="BellOutline"
    class="notificationBell__icon"
    :class="{ 'notificationBell__icon--alert': hasWarnings }"
  />
  <span
  v-if="hasWarnings"
  :class="['notificationBell__badge', { 'notificationBell__badge--alert': hasWarnings }, 'text-light']"
>
  {{ warningCount }}
</span>
</div>
    </template>
    