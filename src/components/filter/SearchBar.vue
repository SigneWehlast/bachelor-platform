<script setup>
import { ref, watch } from "vue";

const props = defineProps({
        modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const searchText = ref(props.modelValue || "");

watch(searchText, (newValue) => {
        emit("update:modelValue", newValue);
});

watch(() => props.modelValue, (newValue) => {
        searchText.value = newValue;
});
</script>

<template>
        <input class="search-bar text-regular" type="text" placeholder="Søg..." v-model="searchText" />
</template>