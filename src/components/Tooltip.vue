<script setup>
import { ref, computed, nextTick } from 'vue';
import Icon from '@/components/Icon.vue';
import tooltipData from '@/config/tooltipData.json';

const props = defineProps({
  type: { type: String, required: true },
  iconName: { type: String, default: 'InformationOutline' }
});

const show = ref(false);
const trigger = ref(null);
const style = ref({});

const tooltipText = computed(() => tooltipData[props.type]);

function open() {
  show.value = true;

  nextTick(() => {
    const rect = trigger.value.getBoundingClientRect();

    style.value = {
      position: 'absolute',
      top: `${rect.top - 8}px`,
      left: `${rect.left + rect.width / 2}px`,
      transform: 'translate(-50%, -100%)',
      zIndex: 9999
    };
  });
}

function close() {
  show.value = false;
}
</script>
<template>
  <div
    class="tooltip"
    ref="trigger"
    @mouseenter="open"
    @mouseleave="close"
  >
    <Icon :name="iconName" class="tooltip__icon" />

    <Teleport to="body">
      <div
        v-if="show"
        class="tooltip__text"
        :style="style"
      >
        {{ tooltipText }}
      </div>
    </Teleport>
  </div>
</template>