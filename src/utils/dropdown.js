export function toggleDropdown(dropdownOpen) {
  if (!dropdownOpen || typeof dropdownOpen.value === 'undefined') {
    return;
  }
  dropdownOpen.value = !dropdownOpen.value;
}
