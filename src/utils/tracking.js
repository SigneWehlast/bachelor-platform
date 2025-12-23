import { trackingStore } from './trackingStore';
import { findMenuPath } from './findPath';
import { menuItems } from '@/config/menuItems';

export function UserTracking(path) {
  const breadcrumbTrail = findMenuPath(menuItems, path);

  if (!breadcrumbTrail) {
    trackingStore.breadcrumbs = [];
    return;
  }

  const breadcrumbs = [];

  breadcrumbTrail.forEach(item => {
    if (item.section && !breadcrumbs.find(b => b.label === item.section)) {
      breadcrumbs.push({
        label: item.section,
        path: '/Administration'
      });
    };

    if (item.label) {
      breadcrumbs.push({
        label: item.label,
        path: item.path
      });
    }
  });

  trackingStore.breadcrumbs = breadcrumbs;
};