import { getUserFullPath } from "./path"
import { trackingStore } from "./trackingStore";


export function UserTracking(item, parentPath = ""){
  const fullPath = getUserFullPath(item, parentPath)

  trackingStore.breadcrumbs = fullPath
  .split('/')
  .map(crumb => crumb.trim())
  .filter(crumb => crumb !== "");
}