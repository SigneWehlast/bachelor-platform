<script setup>
import { useRouter, useRoute } from 'vue-router';
import { menuItems } from '@/config/menuItems';
import { computed, onMounted } from 'vue';
import Icon from '@/components/Icon.vue';

const router = useRouter();
const route = useRoute();

const administration = menuItems[0].children.find(
  item => item.label === 'Administration'
);
const administrationChildren = administration ? administration.children : [];

const sections = computed(() => {
  const map = {};
  administrationChildren.forEach(child => {
    const sectionLabel = child.section || 'Øvrige';
    if (!map[sectionLabel]) map[sectionLabel] = [];
    map[sectionLabel].push(child);
  });
  return map;
});

function goTo(path) {
  router.push(path);
};

onMounted(() => {
  const sectionQuery = route.query.section;
  if (sectionQuery) {
    const el = document.getElementById(sectionQuery);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
});
</script>
<template>
  <div class='administration'>
    <div class='administration__topbar'>
      <h1 class='administration__title h1'>Administration</h1>
    </div>
    <div class='administration__wrapper'>
      <div
        v-for='(children, sectionName) in sections'
        :key='sectionName'
        :id='sectionName'
        class='administration__section'
      >
        <h2 class='administration__section-title h2'>{{ sectionName }}</h2>
        <span class='administration__section-label text-regular'>
          {{ children[0].LabelAdministration || '' }}
        </span>
        <div class='administration__buttons'>
          <button
            v-for="child in children"
            :key="child.path || child.label"
            class="administration__button"
            :disabled="!child.path"
            @click="child.path && goTo(child.path)"
          >
            <Icon
              v-if='child.iconAdministration'
              :name='child.iconAdministration'
              class='administration__button-icon'
            />
            <span class='administration__button-label text-regular'>{{ child.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>