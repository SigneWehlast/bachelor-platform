import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CalendarComp from '@/components/filter/CalendarComp.vue';
import Dropdown from '@/components/filter/Dropdown.vue';
import { getMonths } from '@/services/calendarService';

vi.mock('@/services/calendarService', () => ({
  getMonths: vi.fn()
}));

describe('CalendarComp.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-12-15T00:00:00Z'));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('skal hente måneder og starte med Dagsvisning når  hideDayOption = false', async () => {
    const mockMonths = [
      { label: 'November 2025', value: '2025-11' },
      { label: 'December 2025', value: '2025-12' }
    ];
    getMonths.mockResolvedValue(mockMonths);

    const wrapper = mount(CalendarComp, {
      props: {  hideDayOption: false }
    });

    await flushPromises();

    expect(wrapper.vm.displayOptions).toEqual([
      { label: 'Dagsvisning', value: null },
      ...mockMonths
    ]);

    expect(wrapper.vm.selectedMonth).toBe(null);

    const dropdown = wrapper.findComponent(Dropdown);
    expect(dropdown.exists()).toBe(true);
    expect(dropdown.props('options')).toBe(wrapper.vm.displayOptions);
    expect(dropdown.props('modelValue')).toBe(wrapper.vm.selectedMonth);
  });
});
