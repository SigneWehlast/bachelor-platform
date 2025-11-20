import { getUserFullPath } from "./path"

export function UserTracking(item, parentPath = ""){
  const fullPath = getUserFullPath(item, parentPath)
  console.log("User clicked:", item.label, "full path:", fullPath)
}