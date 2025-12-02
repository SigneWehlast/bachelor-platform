// named export — sørg for .js extension og korrekt sti når du importerer
export function toggleDropdown(dropdownOpen) {
  if (!dropdownOpen || typeof dropdownOpen.value === 'undefined') {
    console.warn('toggleDropdown forventer en Vue ref som argument');
    return;
  }
  dropdownOpen.value = !dropdownOpen.value;
}
