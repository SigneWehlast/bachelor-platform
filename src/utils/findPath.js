export function findMenuPath(menuItems, targetPath, trail = []) {
  for (const item of menuItems) {
    const newTrail = [...trail, item];

    if (item.path === targetPath) {
      return newTrail;
    }

    if (item.children) {
      const found = findMenuPath(item.children, targetPath, newTrail);
      if (found) return found;
    }
  }

  return null;
}
