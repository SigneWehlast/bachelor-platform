import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LatestCustomerChangesContent from "@/components/dashboard/LatestCustomerChangesContent.vue";
import { fetchCustomerChanges } from "@/services/customerChangesService";

vi.mock("@/services/customerChangesService");

const mockCustomers = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Kunde ${i + 1}`,
  date: "2025-12-01",
  isRecent: i < 3
}));

const mountComp = (props = {}) =>
  mount(LatestCustomerChangesContent, {
    props
  });

describe("LatestCustomerChangesContent.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchCustomerChanges.mockResolvedValueOnce(mockCustomers);
  });

  it("henter alle kunder ved mount", async () => {
    const wrapper = mountComp();
    await flushPromises();

    expect(fetchCustomerChanges).toHaveBeenCalled();
    expect(wrapper.vm.customers.length).toBe(25);

    const rows = wrapper.findAll("tbody tr");
    expect(rows.length).toBe(10);
    expect(wrapper.vm.showPagination).toBe(true);
    expect(wrapper.vm.totalPages).toBe(3);
  });

  it("viser alle kunder uden customerLimit, når pagination er aktivt", async () => {
    const wrapper = mountComp();
    await flushPromises();

    expect(wrapper.vm.showPagination).toBe(true);
    expect(wrapper.vm.totalPages).toBe(3);

    const rows = wrapper.findAll("tbody tr");
    expect(rows.length).toBe(10);
  });

  it("viser kun 5 kunder med customerLimit sat til 5 og skjuler pagination", async () => {
    const wrapper = mountComp({ customerLimit: 5 });
    await flushPromises();

    expect(wrapper.vm.showPagination).toBe(false);
    expect(wrapper.vm.showCustomers.length).toBe(5);
    expect(wrapper.vm.paginatedCustomers.length).toBe(5);
    expect(wrapper.find(".latest-customer-changes__pagination").exists()).toBe(false);
  });

  it("nextPage og prevPage ændrer side korrekt via DOM", async () => {
    const wrapper = mountComp();
    await flushPromises();

    const buttons = wrapper.findAll(".latest-customer-changes__pagination-button");
    const prevButton = buttons[0];
    const nextButton = buttons[1];

    expect(prevButton.element.disabled).toBe(true);
    expect(nextButton.element.disabled).toBe(false);

    await nextButton.trigger("click");
    expect(wrapper.vm.currentPage).toBe(2);

    await prevButton.trigger("click");
    expect(wrapper.vm.currentPage).toBe(1);
  });

it("pagination stopper på sidste side", async () => {
  const wrapper = mountComp();
  await flushPromises();

  wrapper.vm.currentPage = wrapper.vm.totalPages;
  await wrapper.vm.$nextTick();

  const buttons = wrapper.findAll(".latest-customer-changes__pagination-button");
  const nextButton = buttons[1];

  expect(nextButton.element.disabled).toBe(true);
});


  it("watch totalPages justerer currentPage når for høj", async () => {
    const wrapper = mountComp();
    await flushPromises();

    wrapper.vm.currentPage = 3;
    wrapper.vm.customers = wrapper.vm.customers.slice(0, 5);
    await flushPromises();

    expect(wrapper.vm.totalPages).toBe(1);
    expect(wrapper.vm.currentPage).toBe(1);
  });

  it("tilføjer 'recent-change' class på kunder, som er kommet inden for 24 timer", async () => {
    const wrapper = mountComp();
    await flushPromises();

    const recentRows = wrapper.findAll("tr.recent-change");
    expect(recentRows.length).toBeGreaterThan(0);
  });
});
