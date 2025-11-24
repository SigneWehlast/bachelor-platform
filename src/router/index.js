import { createRouter, createWebHistory } from "vue-router"
import { menuItems } from "@/config/menuItems"

// Funktion til at flade menuItems ud til routes
function generateRoutes(items) {
  const routes = []

  items.forEach(item => {
    if (item.path && item.view) {
      routes.push({
        path: item.path,
        name: item.label.toLowerCase().replace(/\s+/g, ""),
        component: item.view,
        meta: item.meta || {} 
      })
    }

    // Hvis item har children, rekursivt tilføj dem
    if (item.children) {
      routes.push(...generateRoutes(item.children))
    }
  })

  return routes
}

const routes = generateRoutes(menuItems)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
