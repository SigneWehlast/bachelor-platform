<script setup>
import { ref } from "vue";
import Icon from "../Icon.vue";

const props = defineProps({
  modelValue: [String, Number],
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
  },
  selectedPrefix: {
    type: String,
    default: "" 
  }
});

const emit = defineEmits(["update:modelValue"]);
const open = ref(false);

function toggle() {
  open.value = !open.value;
}

function select(option) {
  const val = typeof option === 'object' && option !== null && 'value' in option
    ? option.value
    : option;

  if (!props.disableOptions.includes(val)) {
    emit("update:modelValue", val);
    open.value = false;
  }
}

function getLabel(option) {
  if (typeof option === 'object' && option !== null && 'label' in option) {
    return option.label;
  }
  return String(option);
}
</script>

<template>
  <div class="dropdown" @click="toggle">
    <p class="text-regular">
      <span v-if="!modelValue">{{ label }}</span>

      <span v-else>
        {{ selectedPrefix ? selectedPrefix + ": " : "" }}
        {{
          (options.find(o =>
            (typeof o === 'object' && 'value' in o ? o.value : o) === modelValue
          ) 
          ? getLabel(options.find(o =>
            (typeof o === 'object' && 'value' in o ? o.value : o) === modelValue
          )) 
          : modelValue)
        }}
      </span>

    </p>
    <Icon
      :name="open ? 'ChevronDoubleUp' : 'ChevronDoubleDown'"
      class="dropdown-icon"
    />
    <ul v-if="open" class="dropdown-options" @click.stop>
      <li
        v-for="(option, index) in options"
        :key="index"
        class="dropdown-item"
        :class="{ 'dropdown-item--disabled':
                  disableOptions.includes(
                    typeof option === 'object' && 'value' in option
                      ? option.value
                      : option
                  )
               }"
        @click="select(option)"
      >
        {{ getLabel(option) }}
      </li>
    </ul>
  </div>
</template>
