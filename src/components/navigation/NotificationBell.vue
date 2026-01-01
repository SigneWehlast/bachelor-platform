<script setup>
import { onMounted, ref, computed } from 'vue';

//Components
import Icon from '@/components/Icon.vue';
import NotificationComp from './NotificationComp.vue';

//Service
import { getCustomersInCarboost } from '@/services/carboostService';
import { getSettings } from '@/services/notificationService';
import { fetchCustomerChanges } from '@/services/customerChangesService';

//Utils
import { matchesNotificationSettings } from '@/utils/filterNotifications';

const open = ref(false);
const settings = getSettings();
const customers = ref([]);

const toggle = () => {
  open.value = !open.value;
};

onMounted(async () => {
  const response = await getCustomersInCarboost(1, 1000);
  const dbCustomers = response.customers || [];

  const fetched = await fetchCustomerChanges();

  const allCustomers = [...dbCustomers];

  fetched.forEach(c => {
    const index = allCustomers.findIndex(dc => dc.id === c.id);
    if (index === -1) {
      allCustomers.push(c);
    } else {
      allCustomers[index] = { ...allCustomers[index], ...c };
    }
  });

  customers.value = allCustomers;
});

const filteredWarnings = computed(() =>
  customers.value.filter(
    c => c.isRecent && settings['new-customers'] || matchesNotificationSettings(c, settings)
  )
);

const warningCount = computed(() => filteredWarnings.value.length);
const hasWarnings = computed(() => warningCount.value > 0);
</script>
<template>
  <div class='notification-bell' @click='toggle'>
    <Icon
      name='BellOutline'
      class='notification-bell__icon'
      :class="{ 'notification-bell__icon--alert': hasWarnings }"
    />
    <span
      v-if='hasWarnings'
      :class="['notification-bell__badge', { 'notification-bell__badge--alert': hasWarnings }, 'text-light']">
      {{ warningCount }}
    </span>
  </div>
  <div v-if="open" class='notification-bell__overlay' @click='open = false'></div>
  <NotificationComp
    v-if='open'
    :customers='filteredWarnings'
    @close='open = false'
  />
</template>