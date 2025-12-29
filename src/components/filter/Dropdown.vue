<script setup>
import { ref } from 'vue';
import Icon from '../Icon.vue';

const props = defineProps({
  modelValue: [String, Number, Array],
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  disableOptions: {
    type: Array,
    default: () => []
  },
  selectedPrefix: {
    type: String,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  alwaysShowLabel: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'select']);
const open = ref(false);

function toggle() {
  open.value = !open.value;
}

function select(option) {
  const val = typeof option === 'object' && option !== null && 'value' in option
    ? option.value
    : option;

  if (props.disableOptions.includes(val)) return;

  if (props.multiple) {
    const current = Array.isArray(props.modelValue)
      ? [...props.modelValue]
      : [];

    if (current.includes(val)) {
      emit('update:modelValue', current.filter(v => v !== val));
    } else {
      emit('update:modelValue', [...current, val]);
    }

    emit('select', val);
  } else {
    emit('update:modelValue', val);
    emit('select', val);
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
  <div class='dropdown' @click='toggle'>
    <p class='text-regular'>
      <template v-if='alwaysShowLabel'>
        {{ label }}
      </template>
      <template v-else>
        <span v-if='!modelValue || (Array.isArray(modelValue) && modelValue.length === 0)'>
          {{ label }}
        </span>
        <span v-else>
          {{ selectedPrefix ? selectedPrefix + ': ' : '' }}
          <template v-if='Array.isArray(modelValue)'>
            {{ modelValue
              .map(v => {
                const option = options.find(o => (typeof o === 'object' && 'value' in o ? o.value : o) === v);
                return option ? getLabel(option) : v;
              })
              .join(', ')
            }}
          </template>
          <template v-else>
            {{
              (options.find(o => (typeof o === 'object' && 'value' in o ? o.value : o) === modelValue)
                ? getLabel(options.find(o => (typeof o === 'object' && 'value' in o ? o.value : o) === modelValue))
                : modelValue)
            }}
          </template>
        </span>
      </template>
    </p>
    <Icon
      :name="open ? 'ChevronDoubleUp' : 'ChevronDoubleDown'"
      class='dropdown-icon'
    />
    <ul v-if='open' class='dropdown-options' @click.stop>
      <li
        v-for='(option, index) in options'
        :key='index'
        class='dropdown-item'
        :class="{ 'dropdown-item--disabled':
                  disableOptions.includes(
                    typeof option === 'object' && 'value' in option
                      ? option.value
                      : option
                  )
               }"
        @click='select(option)'
      >
        <input
          v-if="multiple && !disableOptions.includes(typeof option === 'object' && 'value' in option ? option.value : option)"
          type='checkbox'
          :checked="Array.isArray(modelValue) && modelValue.includes(typeof option === 'object' && 'value' in option ? option.value : option)"
          readonly
        />
        {{ getLabel(option) }}
      </li>
    </ul>
  </div>
</template>
