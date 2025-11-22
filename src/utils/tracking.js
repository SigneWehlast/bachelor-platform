import { getUserFullPath } from "./path"
import { trackingStore } from "./trackingStore";


export function UserTracking(item, parentPath = ""){
  const fullPath = getUserFullPath(item, parentPath)
  console.log("User clicked:", item.label, "full path:", fullPath)

  trackingStore.lastMessage = `${fullPath}`;
}