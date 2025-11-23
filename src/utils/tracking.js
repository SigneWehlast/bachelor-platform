import { trackingStore } from "./trackingStore";
import { findMenuPath } from "./findPath";
import { menuItems } from "@/config/menuItems";


export function UserTracking(path) {
  const breadcrumbTrail = findMenuPath(menuItems, path);

  if (!breadcrumbTrail) {
    trackingStore.breadcrumbs = [];
    return;
  }

  trackingStore.breadcrumbs = breadcrumbTrail.map(item => ({
    label: item.label,
    path: item.path
  }));
}