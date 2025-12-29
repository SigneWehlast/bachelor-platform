<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import Icon from '@/components/Icon.vue';

const props = defineProps({
  customers: {
    type: Array,
    required: true
  }
});


const router = useRouter();

const emit = defineEmits(['close']);
function handleClose() {
  emit('close');
};

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
      <div v-if="props.customers.length > 0">
      <div
        v-for="c in props.customers"
        :key='c.id'
        class='notification-comp__list'
      >
        <div
          class='notification-comp__list-item'
          @click='() => navigate(c)'
          style='cursor: pointer;'
        >
          <div>
            <Icon
              v-if='c.yesterdays_dif > 9 && c.todays_dif / c.yesterdays_dif < 0.5'
              name='AlertCircle'
              class='notification-comp__list-icon notification-comp__list-icon--red'
            />
            <Icon
              v-else-if='c.yesterdays_dif > 9 && c.todays_dif / c.yesterdays_dif < 0.7'
              name='Alert'
              class='notification-comp__list-icon notification-comp__list-icon--yellow'
            />
            <Icon
              v-else-if="c.yesterdays_dif > 0 && c.todays_dif / c.yesterdays_dif > 1.5"
              name="ArrowUpBold"
              class="notification-comp__list-icon notification-comp__list-icon--green"
            />
            <Icon
              v-if='c.isRecent'
              name='CarSearchOutline'
              class='notification-comp__list-icon notification-comp__list-icon--green'
            />
          </div>
          &nbsp;
          <span>
            {{ c.name.length > 15 ? c.name.slice(0, 15) + '…' : c.name }}
            <span v-if='c.isRecent'>er en ny kunde</span>
            <span v-if="c.yesterdays_dif > 9 && c.todays_dif / c.yesterdays_dif < 0.7">
              leads er faldet
            </span>
            <span v-else-if="c.yesterdays_dif > 0 && c.todays_dif / c.yesterdays_dif > 1.5">
              leads er steget
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