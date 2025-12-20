<script setup>
import { onMounted, ref, computed } from "vue";
import Icon from "@/components/Icon.vue";
import NotificationComp from "./NotificationComp.vue";
import { useCarboostWarnings } from "@/utils/CarboostWarnings.js";
import { getCustomersInCarboost } from "@/services/carboostService";

const { setCustomers, warningCustomers, hasWarnings, warningCount } = useCarboostWarnings();

const open = ref(false);
const toggle = () => open.value = !open.value;

const warningCustomerList = computed(() => warningCustomers.value || []);

onMounted(async () => {
  const response = await getCustomersInCarboost(1, 99999);
  setCustomers(response.customers || []);
});
</script>

<template>
  <div class="notification-bell" @click="toggle">
    <Icon
      name="BellOutline"
      class="notification-bell__icon"
      :class="{ 'notification-bell__icon--alert': hasWarnings }"
    />
    <span
      v-if="hasWarnings"
      :class="['notification-bell__badge', { 'notification-bell__badge--alert': hasWarnings }, 'text-light']"
    >
      {{ warningCount }}
    </span>
  </div>
    <div v-if="open" class="notification-bell__overlay" @click="open = false"></div>
    <NotificationComp v-if="open" :customers="warningCustomerList" @close="open = false" />
</template>