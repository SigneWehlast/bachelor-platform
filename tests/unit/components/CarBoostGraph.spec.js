import { mount, flushPromises } from '@vue/test-utils';
import CarBoostGraph from '@/components/CarBoostGraph.vue';
import ApexCharts from 'apexcharts';
import { getHistoryCarboost } from '@/services/historyService';
import { describe, it, expect, vi } from 'vitest';

vi.mock('apexcharts', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      render: vi.fn(),
      destroy: vi.fn()
    }))
  };
});

vi.mock('@/services/historyService', () => ({
  getHistoryCarboost: vi.fn()
}));

describe('CarBoostGraph.vue', () => {
  it('onMounted sætter history', async () => {
    getHistoryCarboost.mockResolvedValueOnce({
      history: [{ id: 1, name: 'Kunde 1', archived_at: '2025-11-30', dif_leads: 5 }]
    });

    const wrapper = mount(CarBoostGraph, {
      props: { selectedIds: [1], customers: [{ id:1, name:'Kunde 1' }] }
    });

    await flushPromises();

    expect(wrapper.vm.history.length).toBe(1);
    expect(ApexCharts).toHaveBeenCalled();
  });
});
