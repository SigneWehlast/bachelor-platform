<script setup>
import { ref } from "vue";
import Icon from "../Icon.vue";

const props = defineProps({
  modelValue: String,
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ""
  },
  disableOptions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["update:modelValue"]);
const open = ref(false);

function toggle() {
  open.value = !open.value;
}

function select(option) {
  if (!props.disableOptions.includes(option)) {
    emit("update:modelValue", option);
    open.value = false;
  }
}
</script>

<template>
  <div class="dropdown" @click="toggle">
    <p class="text-regular">{{ label }} {{ modelValue }}</p>

    <Icon
        :name="open ? 'ChevronDoubleUp' : 'ChevronDoubleDown'"
        class="dropdown-icon"
    />

    <ul v-if="open" class="dropdown-options" @click.stop>
      <li
        v-for="(option, index) in options"
        :key="index"
        class="dropdown-item"
        :class="{ 'dropdown-item--disabled': disableOptions.includes(option) }"
        @click="select(option)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>