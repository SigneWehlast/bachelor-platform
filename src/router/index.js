import { createRouter, createWebHashHistory } from 'vue-router';
import { menuItems } from '@/config/menuItems';
import { UserTracking } from '@/utils/tracking';

function generateRoutes(items) {
  const routes = [];

  items.forEach(item => {
    // Only generate route if path and view exists
    if (item.path && item.view) {
      routes.push({
        path: item.path,
        name: item.label.toLowerCase().replace(/\s+/g, ''),
        component: item.view,
        meta: item.meta || {}
      });
    }

    //Only recursive if children exist and are an array
    if (Array.isArray(item.children) && item.children.length > 0) {
      routes.push(...generateRoutes(item.children));
    }
  });

  return routes;
}

const routes = generateRoutes(menuItems);

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
});


router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');

  if (!isLoggedIn && to.path !== '/login') {
    return next('/login');
  }
  next();
});

router.afterEach((to) => {
  UserTracking(to.path);
  document.title = to.meta.title || 'CarAds';
});

export default router;
