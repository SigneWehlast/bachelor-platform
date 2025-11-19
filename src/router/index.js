import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView,
    },
    {
      path: '/administration',
      name: 'administration',
      component: () => import('../views/AdministrationView.vue'),
    },
        {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
        {
      path: '/carboost',
      name: 'carboost',
      component: () => import('../views/CarBoostView.vue'),
    },
            {
      path: '/customerchanges',
      name: 'customerchanges',
      component: () => import('../views/CustomerChanges.vue'),
    },
    {
      path: '/sales',
      name: 'sales',
      component: () => import('../views/SalesView.vue'),
    },
        {
      path: '/nontificationsettings',
      name: 'nontificationsettings',
      component: () => import('../views/NotificationSettings.vue'),
    },
  ],
})

export default router
