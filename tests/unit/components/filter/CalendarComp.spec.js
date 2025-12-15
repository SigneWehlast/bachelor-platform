import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock('@/services/calendarService', () => ({
  getMonths: vi.fn()
}));

import CalendarComp from '@/components/filter/CalendarComp.vue';
import Dropdown from '@/components/filter/Dropdown.vue';
import { getMonths } from '@/services/calendarService';
import { mount } from '@vue/test-utils';

describe('CalendarComp.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('skal hente måneder og sætte displayOptions og selectedMonth korrekt', async () => {
    const mockMonths = [
      { label: 'November 2025', value: '2025-11' },
      { label: 'December 2025', value: '2025-12' }
    ];
    getMonths.mockResolvedValue(mockMonths);

    const wrapper = mount(CalendarComp);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(getMonths).toHaveBeenCalled();
    expect(wrapper.vm.displayOptions).toEqual(mockMonths);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const exists = mockMonths.find(o => o.value === currentMonth);
    expect(wrapper.vm.selectedMonth).toBe(exists ? currentMonth : mockMonths[0].value);

    const dropdown = wrapper.findComponent(Dropdown);
    expect(dropdown.exists()).toBe(true);
    expect(dropdown.props('options')).toBe(wrapper.vm.displayOptions);
    expect(dropdown.props('modelValue')).toBe(wrapper.vm.selectedMonth);
  });
});
