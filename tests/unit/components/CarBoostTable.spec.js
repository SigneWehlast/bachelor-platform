import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import CarboostTable from "@/components/CarBoostTable.vue";

vi.mock("@/components/modals/ShowCustomerCarBoostModal.vue", () => ({
  default: { template: "<div class='modal'></div>" }
}));

vi.mock("@/services/carboostService", () => ({
  getCustomersInCarboost: vi.fn(),
  getCustomersInCarboostByDate: vi.fn(),
  getCustomersCarboostChange: vi.fn()
}));

import { 
  getCustomersInCarboost,
  getCustomersInCarboostByDate,
  getCustomersCarboostChange
} from "@/services/carboostService";

const mountComp = (props = {}) =>
  mount(CarboostTable, {
    props: {
      customers: [],
      highlightedIds: [],
      showOnlySelected: false,
      hidePagination: false,
      selectedMonth: null,
      visibleColumns: ['change', 'lastUpdated'],
      ...props
    }
  });

describe("CarboostTable.vue", () => {
  const mockCustomers = [
    { id: 1, name: "Carboost", leads: 10, change: 2, tendens: 'up', last_updated: '2025-12-20', todays_dif: 5, yesterdays_dif: 10 },
    { id: 2, name: "Bjarnes biler", leads: 5, change: -1, tendens: 'down', last_updated: '2025-12-19', todays_dif: 2, yesterdays_dif: 8 }
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    getCustomersInCarboost.mockResolvedValue({ customers: mockCustomers });
    getCustomersInCarboostByDate.mockResolvedValue({ customers: mockCustomers });
    getCustomersCarboostChange.mockResolvedValue({ customers: mockCustomers });
  });

  it("fetchAll henter alle kunder når selectedMonth = null", async () => {
    const wrapper = mountComp();
    await flushPromises();

    expect(getCustomersInCarboost).toHaveBeenCalledWith(1, 99999);
    expect(wrapper.vm.carboostCustomers.length).toBe(mockCustomers.length);
  });

  it("fetchAll henter kunder efter dato når selectedMonth != null", async () => {
    const wrapper = mountComp({ selectedMonth: "2025-12" });
    await flushPromises();

    expect(getCustomersInCarboostByDate).toHaveBeenCalledWith("2025-12");
    expect(wrapper.vm.carboostCustomers[0].id).toBe(mockCustomers[0].id);
  });

  it("sortedCustomers sorterer efter navn korrekt", async () => {
    const wrapper = mountComp();
    wrapper.vm.carboostCustomers = [
      { id: 1, name: "CarBoost" },
      { id: 2, name: "Bjarnes biler" },
      { id: 3, name: "Test kunde" }
    ];

    wrapper.vm.sortTableBy = "name";
    wrapper.vm.sortDirection = "asc";

    expect(wrapper.vm.sortedCustomers.map(c => c.name)).toEqual([
      "Bjarnes biler", "CarBoost", "Test kunde"
    ]);
  });

  it("sortedCustomers sorterer leads korrekt", async () => {
    const wrapper = mountComp();
    wrapper.vm.carboostCustomers = [
      { name: "Bjarnes biler", leads: 50 },
      { name: "CarBoost", leads: 10 },
      { name: "Test kunde", leads: 30 }
    ];

    wrapper.vm.sortTableBy = "leads";
    wrapper.vm.sortDirection = "desc";

    expect(wrapper.vm.sortedCustomers.map(c => c.leads)).toEqual([50, 30, 10]);
  });

  it("paginatedCustomers viser kun 10 kunder pr. side", async () => {
    const wrapper = mountComp();
    wrapper.vm.carboostCustomers = Array.from({ length: 25 }, (_, i) => ({ id: i, name: `C${i}` }));

    wrapper.vm.currentPage = 1;
    expect(wrapper.vm.paginatedCustomers.length).toBe(10);

    wrapper.vm.currentPage = 3;
    expect(wrapper.vm.paginatedCustomers.length).toBe(5);
  });

  it("toggleSelection tilføjer og fjerner korrekt", async () => {
    const wrapper = mountComp();

    wrapper.vm.toggleSelection(1);
    expect(wrapper.emitted()["update:selectedIds"][0][0]).toEqual([1]);

    wrapper.vm.toggleSelection(1);
    expect(wrapper.emitted()["update:selectedIds"][1][0]).toEqual([]);
  });

  it("watch med selectedMonth resetter og kalder fetchAll", async () => {
    const wrapper = mountComp({ selectedMonth: null });
    await flushPromises();
    expect(getCustomersInCarboost).toHaveBeenCalledTimes(1);

    wrapper.setProps({ selectedMonth: "2025-12" });
    await nextTick();
    await flushPromises();

    expect(wrapper.vm.currentPage).toBe(1);
    expect(wrapper.vm.selectedIds.length).toBe(0);
    expect(getCustomersInCarboostByDate).toHaveBeenCalledWith("2025-12");
  });

  it("openModalWithCustomer vælger kunden og viser modal", () => {
    const wrapper = mountComp();
    const customer = { id: 10, name: "Test kunde" };
    wrapper.vm.openModalWithCustomer(customer);

    expect(wrapper.vm.selectedCustomer).toEqual(customer);
    expect(wrapper.vm.showModal).toBe(true);
  });

  it("viser modal når showModal = true", async () => {
    const wrapper = mountComp();
    wrapper.vm.showModal = true;
    await nextTick();

    expect(wrapper.find(".modal").exists()).toBe(true);
  });
});
