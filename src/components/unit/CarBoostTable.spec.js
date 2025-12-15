import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import Component from "@/components/CarBoostTable.vue";

vi.mock("@/components/modals/ShowCustomerCarBoostModal.vue", () => ({
  default: { template: "<div class='modal'></div>" }
}));

vi.mock("@/services/carboostService", () => ({
  getCustomersInCarboost: vi.fn(),
  getCustomersInCarboostByDate: vi.fn()
}));

import { 
  getCustomersInCarboost,
  getCustomersInCarboostByDate
} from "@/services/carboostService";

const mountComp = (props = {}) =>
  mount(Component, {
    props: {
      customers: [],
      highlightedIds: [],
      showOnlySelected: false,
      hidePagination: false,
      selectedMonth: null,
      ...props
    }
  });


describe("CarboostTable.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getMonthlyLeads grupperer korrekt og tager seneste dato pr. måned", () => {
    const wrapper = mountComp();

    const history = [
      { archived_at: "2025-11-30", leads: 10 },
      { archived_at: "2025-12-20", leads: 20 },
      { archived_at: "2025-12-11", leads: 30 }
    ];

    const res = wrapper.vm.getMonthlyLeads(history);

    expect(res.length).toBe(2);
    const nov = res.find(x => new Date(x.archived_at).getMonth() === 10);
    const dec = res.find(x => new Date(x.archived_at).getMonth() === 11);

    expect(nov.monthlyLeads).toBe(10);
    expect(dec.monthlyLeads).toBe(20);

  });

  it("fetchAll henter alle kunder når selectedMonth = null", async () => {
    getCustomersInCarboost.mockResolvedValueOnce({
      customers: [{ id: 1, name: "Kunde 1", history: [] }]
    });

    const wrapper = mountComp();
    await flushPromises();

    expect(getCustomersInCarboost).toHaveBeenCalledWith(1, 99999);
    expect(wrapper.vm.carboostCustomers.length).toBe(1);
  });

  it("fetchAll henter kunder efter dato når selectedMonth != null", async () => {
    getCustomersInCarboostByDate.mockResolvedValueOnce({
      customers: [{ id: 3, name: "Kunde 3", history: [] }]
    });

    const wrapper = mountComp({ selectedMonth: "2025-11" });
    await flushPromises();

    expect(getCustomersInCarboostByDate).toHaveBeenCalledWith("2025-11");
    expect(wrapper.vm.carboostCustomers[0].id).toBe(3);
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

    expect(wrapper.vm.sortedCustomers.map(x => x.name)).toEqual([
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

    expect(wrapper.vm.sortedCustomers.map(x => x.leads)).toEqual([50, 30, 10]);
  });

  it("paginatedCustomers viser kun 10 pr side", () => {
    const wrapper = mountComp();

    wrapper.vm.carboostCustomers = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      name: "C" + i
    }));

    wrapper.vm.totalPages = 3;

    wrapper.vm.currentPage = 1;
    expect(wrapper.vm.paginatedCustomers.length).toBe(10);

    wrapper.vm.currentPage = 3;
    expect(wrapper.vm.paginatedCustomers.length).toBe(5);
  });

  it("toggleSelection tilføjer og fjerner korrekt", async () => {
    const wrapper = mountComp();

    wrapper.vm.toggleSelection(5);
    expect(wrapper.emitted()["update:selectedIds"][0][0]).toEqual([5]);

    wrapper.vm.toggleSelection(5);
    expect(wrapper.emitted()["update:selectedIds"][1][0]).toEqual([]);
  });

  it("watch(selectedMonth) resetter og kalder fetchAll", async () => {
    getCustomersInCarboostByDate.mockResolvedValueOnce({ customers: [] });

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

  it("openModalWithCustomer sætter kunden og viser modal", () => {
    const wrapper = mountComp();

    const customer = { id: 10, name: "Kunde 10" };
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