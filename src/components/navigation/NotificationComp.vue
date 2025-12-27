<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Icon from '@/components/Icon.vue';
import { fetchCustomerChanges } from '@/services/customerChangesService';

const customers = ref([]);
const newCustomers = ref([]);

const router = useRouter();

const emit = defineEmits(['close']);
function handleClose() {
  emit('close');
};

const props = defineProps({
  customers: {
    type: Array,
    required: true
  }
});

onMounted(async () => {
  const fetched = await fetchCustomerChanges();
  newCustomers.value = fetched.filter(c =>
    c.isRecent && !props.customers.find(pc => pc.id === c.id)
  );
});

const allCustomers = computed(() => [...props.customers, ...newCustomers.value]);

const navigate = (customer) => {
  if (customer.isRecent) {
    router.push('/dashboard/customerchanges');
    handleClose();
  } else if (customer.yesterdays_dif > 9 && customer.todays_dif / customer.yesterdays_dif < 0.7) {
    router.push('/lead-view');
    handleClose();
  }
};
</script>

<template>
  <div class='notification-comp'>
    <h3>Notifikationer</h3>
    <span class='notification-comp__line'></span>
      <div v-if="allCustomers.length > 0 && notificationService.leadsEnabled">
      <div
        v-for='customer in allCustomers'
        :key='customer.id'
        class='notification-comp__list'
      >
        <div
          class='notification-comp__list-item'
          @click='() => navigate(customer)'
          style='cursor: pointer;'
        >
          <div>
            <Icon
              v-if='customer.yesterdays_dif > 9 && customer.todays_dif / customer.yesterdays_dif < 0.5'
              name='AlertCircle'
              class='notification-comp__list-icon notification-comp__list-icon--red'
            />
            <Icon
              v-else-if='customer.yesterdays_dif > 9 && customer.todays_dif / customer.yesterdays_dif < 0.7'
              name='Alert'
              class='notification-comp__list-icon notification-comp__list-icon--yellow'
            />
            <Icon
              v-if='customer.isRecent'
              name='CarSearchOutline'
              class='notification-comp__list-icon notification-comp__list-icon--green'
            />
          </div>
          &nbsp;
          <span>
            {{ customer.name.length > 15 ? customer.name.slice(0, 15) + '…' : customer.name }}
            <span v-if='customer.isRecent'>er en ny kunde</span>
            <span
              v-else-if='customer.yesterdays_dif > 9 && customer.todays_dif / customer.yesterdays_dif < 0.5'
            >
              leads er faldet
            </span>
          </span>
        </div>
      </div>
    </div>
    <div v-else class="notification-comp__empty">
      Ingen notifikationer
    </div>
  </div>
</template>