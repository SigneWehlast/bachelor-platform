<script setup>
import { menuItems } from "@/config/menuItems"
import Icon from "@/components/Icon.vue"
import { ref } from "vue"
import { useRoute } from "vue-router"
import logo from '@/assets/images/Carads_logo_dark_text.svg';


const route = useRoute()

// Holder styr på hvilken dropdown er åben
const openDropdowns = ref({})


// Toggle dropdown
const toggleDropdown = (label) => {
  const newState = {}

  if (openDropdowns.value[label]) {
    openDropdowns.value = {}
  } else {
    newState[label] = true
    openDropdowns.value = newState
  }
  console.log("State:", openDropdowns.value)
}

const getUserFullPath = (item, parentPath = "") => {
  if (!item.path) return parentPath
  // Hvis item.path starter med /, så betragtes det som absolut
  if (item.path.startsWith("/")) return parentPath + item.path
  return parentPath + "/" + item.path
}

const UserTracking = (item, parentPath = "") => {
  const fullPath = getUserFullPath(item, parentPath)
  console.log("User clicked:", item.label, "full path:", fullPath)
}
</script>

<template>
  <nav class="sidebar">
    <div class="sidebar__top">
      <img :src="logo" alt="Carads Logo" class="sidebar__logo"/>
      <Icon name="BellOutline" class="sidebar__icon" />
    </div>
<div class="sidebar__sectionwrapper">
    <div v-for="section in menuItems" :key="section.label" class="sidebar__section">
      <h4 class="h4 sidebar__label">{{ section.label }}</h4>

      <template v-for="item in section.children" :key="item.label">
        <div v-if="!item.hidden" class="sidebar__item-wrapper">
          <div class="sidebar__item" @click.stop="item.children && toggleDropdown(item.label)"
            :class="{ 'sidebar__item--open': openDropdowns[item.label] }">
              <RouterLink 
                :to="item.path || '#'" 
                class="sidebar__link"
                @click="UserTracking(item)"
              >
              <Icon 
                v-if="item.icon" 
                :name="item.icon" 
                :class="['sidebar__icon', { 'sidebar__icon--open': openDropdowns[item.label] }]" 
              />
              <span class="sidebar__label text-medium">{{ item.label }}</span>
            </RouterLink>

            <!-- Dropdown ikon -->
            <Icon
              v-if="item.children"
              @click.stop="toggleDropdown(item.label)"
              :name="openDropdowns[item.label] ? 'ChevronDoubleDown' : 'ChevronRight'"
              class="sidebar__dropdown-icon"
            />
          </div>

          <!-- Dropdown menu -->
          <div v-if="item.children && openDropdowns[item.label]" class="sidebar__dropdown text-medium">
            <div
              v-for="subItem in item.children"
              :key="subItem.label"
              class="sidebar__dropdown-item"
            >
              <RouterLink 
                :to="subItem.path || '#'" 
                class="sidebar__dropdown-link"
                  :class="{ 'sidebar__dropdown-link--active': route.path === subItem.path }"
                @click="UserTracking(subItem, item.path)"
              >
                <Icon :name="subItem.icon || 'CircleSmall'" class="sidebar__icon" />
                <Icon v-if="subItem.icon" :name="subItem.icon" class="sidebar__icon" />
                <span class="text-medium">{{ subItem.label }}</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </template>
    </div>
    </div>
    <div class="sidebar__bottom">
  <p  class="sidebar__bottom-icon">KN</p>
  <div class="sidebar__bottom-userdetails">
    <p class="sidebar__bottom-username text-medium">Kasper. H. Nielsen</p>
    <p class="sidebar__bottom-role text-medium">Studendermedhjælper</p>
  </div>
</div>
  </nav>
</template>