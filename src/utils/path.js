export function getUserFullPath(item, parentPath = "") {
  if (!item.path) return parentPath
  if (item.path.startsWith("/")) return parentPath + item.path
  return parentPath + "/" + item.path
}
