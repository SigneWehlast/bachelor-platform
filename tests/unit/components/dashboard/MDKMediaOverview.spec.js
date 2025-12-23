import { mount, flushPromises } from '@vue/test-utils';
import MDKMediaOverview from '@/components/dashboard/MDKMediaOverview.vue';
import { getCustomersInCarboost } from '@/services/carboostService';
import { ref } from 'vue';
import { vi, describe, beforeEach, it, expect } from 'vitest';

const mockGroups = [
  { groupName: 'Carboost', customerCount: 5 },
  { groupName: 'Carweb', customerCount: 10 }
];

const mockCarboost = {
  customers: [{ id: 1 }, { id: 2 }]
};

vi.mock('@/services/groupOverviewService', () => ({
  getCustomersInGroups: vi.fn(() => Promise.resolve(mockGroups))
}));

const setCustomersSpy = vi.fn();
const warningCustomersRef = ref([]);
vi.mock('@/utils/CarboostWarnings.js', () => ({
  useCarboostWarnings: () => ({
    setCustomers: setCustomersSpy,
    warningCustomers: warningCustomersRef
  })
}));

import { getCustomersInGroups } from '@/services/groupOverviewService';
import { getCustomersInCarboost } from '@/services/carboostService';

describe('MDKMediaOverview.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    warningCustomersRef.value = [];
  });

  it('henter grupper og carboost kunder ved mount', async () => {
    const wrapper = mount(MDKMediaOverview);

    await flushPromises();

    expect(getCustomersInGroups).toHaveBeenCalled();
    expect(getCustomersInCarboost).toHaveBeenCalledWith(1, 99999);

    expect(setCustomersSpy).toHaveBeenCalledWith(mockCarboost.customers);

    const combined = wrapper.vm.combinedOverview;
    expect(combined).toHaveLength(mockGroups.length + 1);
    expect(combined[0]).toEqual({ name: 'Advarsler', data: 0 });
    expect(combined[1]).toEqual({ name: 'Carboost', data: 5 });
    expect(combined[2]).toEqual({ name: 'Carweb', data: 10 });
  });

  it('renderer korrekt', async () => {
    const wrapper = mount(MDKMediaOverview);

    await flushPromises();

    const boxes = wrapper.findAll('.mdkmedia-overview__content__box');
    expect(boxes).toHaveLength(mockGroups.length + 1);
    expect(boxes[0].text()).toContain('Advarsler');
    expect(boxes[1].text()).toContain('Carboost');
    expect(boxes[2].text()).toContain('Carweb');
  });
});