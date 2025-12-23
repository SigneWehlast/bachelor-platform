import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ApexCharts from 'apexcharts';

vi.mock('@/components/filter/CalendarComp.vue', () => ({ default: { template: '<div></div>' } }));
vi.mock('@/components/CarBoostTable.vue', () => ({
  default: {
    name: 'CarBoostTable',
    props: ['highlightedIds', 'showOnlySelected', 'hidePagination', 'tableInModal', 'visibleColumns', 'selectedMonth'],
    template: '<div class="carboost-table"></div>'
  }
}));
vi.mock('@/components/CarBoostGraph.vue', () => ({ default: { template: '<div></div>' } }));
vi.mock('@/components/filter/ExportData.vue', () => ({ default: { template: '<div></div>' } }));

vi.mock('apexcharts', () => ({
  default: vi.fn().mockImplementation(() => ({ render: vi.fn(), destroy: vi.fn() }))
}));

vi.mock('@/services/historyService', () => ({
  getHistoryCarboost: vi.fn().mockResolvedValue({ history: [] })
}));

import { getHistoryCarboost } from '@/services/historyService';
import ShowCustomerCarboostModal from '@/components/modals/ShowCustomerCarBoostModal.vue';

describe('ShowCustomerCarboostModal.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComp = (props = {}) =>
    mount(ShowCustomerCarboostModal, {
      props: {
        customer: { id: 1, name: 'Bjarnes biler', tendens: 'up' },
        ...props
      }
    });

  it('emitter close når handleClose kaldes', async () => {
    const wrapper = mountComp();
    await wrapper.vm.handleClose();
    expect(wrapper.emitted()['close']).toBeTruthy();
    expect(wrapper.emitted()['close'].length).toBe(1);
  });

  it('onMounted henter history og sætter history', async () => {
    getHistoryCarboost.mockResolvedValueOnce({
      history: [
        { id: 1, archived_at: '2025-12-01T00:00:00Z', leads: 5, dif_leads: 10, change: 2 }
      ]
    });

    const wrapper = mountComp();
    await flushPromises();

    expect(getHistoryCarboost).toHaveBeenCalled();
    expect(wrapper.vm.history.length).toBe(1);
    expect(wrapper.vm.history[0].dif_leads).toBe(10);
  });

  it('sletter graf når history er tom', async () => {
    const wrapper = mountComp();
    wrapper.vm.history = [];
    await wrapper.vm.$nextTick();
    expect(ApexCharts).not.toHaveBeenCalled();
  });

  it('viser graf med korrekt data', async () => {
    getHistoryCarboost.mockResolvedValueOnce({
      history: [
        { id: 1, archived_at: '2025-12-01T00:00:00Z', leads: 5, dif_leads: 5 },
        { id: 1, archived_at: '2025-12-02T00:00:00Z', leads: 7, dif_leads: 10 }
      ]
    });

    const wrapper = mountComp();
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(ApexCharts).toHaveBeenCalled();
    const chartInstance = ApexCharts.mock.results[0].value;
    expect(chartInstance.render).toHaveBeenCalled();
  });

  it('tendensDown er true hvis customer.tendens = down', () => {
    const wrapper = mountComp({ customer: { id: 1, name: 'Bjarnes biler', tendens: 'down' } });
    expect(wrapper.vm.tendensDown).toBe(true);
  });

  it('tendensDown er false hvis customer.tendens != down', () => {
    const wrapper = mountComp({ customer: { id: 1, name: 'Bjarnes biler', tendens: 'up' } });
    expect(wrapper.vm.tendensDown).toBe(false);
  });

  it('viser alert når tendensDown = true', async () => {
    const wrapper = mountComp({ customer: { id: 1, name: 'Bjarnes biler', tendens: 'down' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.show-customer-carboost-modal__topbar-alert').exists()).toBe(true);
  });

  it('viser ikke alert når tendensDown = false', async () => {
    const wrapper = mountComp({ customer: { id: 1, name: 'Bjarnes biler', tendens: 'up' } });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.show-customer-carboost-modal__topbar-alert').exists()).toBe(false);
  });

  it('CarBoostTable får korrekte props', () => {
    const wrapper = mountComp();
    const table = wrapper.findComponent({ name: 'CarBoostTable' });
    expect(table.exists()).toBe(true);
    expect(table.props('highlightedIds')).toEqual([1]);
    expect(table.props('showOnlySelected')).toBe(true);
    expect(table.props('hidePagination')).toBe(true);
    expect(table.props('tableInModal')).toBe(true);
    expect(table.props('visibleColumns')).toEqual(['change', 'lastUpdated', 'tendens', 'period']);
    expect(table.props('selectedMonth')).toBe(wrapper.vm.selectedMonth);
  });

  it('customerData sættes korrekt ud fra history og selectedMonth', async () => {
    getHistoryCarboost.mockResolvedValueOnce({
      history: [
        { id: 1, archived_at: '2025-12-02T00:00:00Z', leads: 3, dif_leads: 1, change: 0 },
        { id: 1, archived_at: '2025-12-01T00:00:00Z', leads: 5, dif_leads: 2, change: 1 }
      ]
    });

    const wrapper = mountComp();
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.customerData.length).toBe(1);
    expect(wrapper.vm.customerData[0].leads).toBe(3);
    expect(wrapper.vm.customerData[0].name).toBe('Bjarnes biler');
  });

  it('lastUpdated returnerer korrekt dato', async () => {
    getHistoryCarboost.mockResolvedValueOnce({
      history: [
        { id: 1, archived_at: '2025-12-02T00:00:00Z', leads: 3, dif_leads: 1 },
        { id: 1, archived_at: '2025-12-01T00:00:00Z', leads: 5, dif_leads: 2 }
      ]
    });

    const wrapper = mountComp();
    await flushPromises();
    const lastUpdated = new Date(wrapper.vm.customerData[0].last_updated).toLocaleDateString('da-DK');
    expect(lastUpdated).toBe(new Date('2025-12-02T00:00:00Z').toLocaleDateString('da-DK'));
  });
});