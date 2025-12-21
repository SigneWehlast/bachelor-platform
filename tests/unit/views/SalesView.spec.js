import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SalesView from "@/views/SalesView.vue";

vi.mock("@/services/customerService", () => ({
  getCustomers: vi.fn(),
  getSelectedCustomers: vi.fn()
}));

vi.mock("@/utils/goBack", () => ({
  useGoBack: () => ({
    showTable: false,
    goBack: vi.fn(),
    show: vi.fn()
  })
}));

import { getCustomers, getSelectedCustomers } from "@/services/customerService";

describe("SalesView.vue", () => {
  const mockCustomers = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Kunde ${i + 1}`,
    numberOfCars: i * 10
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    getCustomers.mockResolvedValue(mockCustomers);
    getSelectedCustomers.mockResolvedValue(mockCustomers);
  });

  it("henter kunder når view mountes", async () => {
    const wrapper = mount(SalesView, {
      global: {
        stubs: {
          RouterLink: true,
          BreadcrumbsComp: true,
          SaleTable: true,
          Dropdown: true,
          SearchBar: true,
          CalendarComp: true,
          CustomerName: true,
          ExportData: true,
          ConfirmationModal: true,
        },
      },
    });

    await flushPromises();

    expect(getCustomers).toHaveBeenCalled();
    expect(wrapper.vm.salesCustomers.length).toBe(mockCustomers.length);
  });

  it("vælger en kunde når der klikkes på den", async () => {
    const wrapper = mount(SalesView, {
      global: {
        stubs: {
          RouterLink: true,
          BreadcrumbsComp: true,
          SaleTable: true,
          Dropdown: true,
          SearchBar: true,
          CalendarComp: true,
          CustomerName: true,
          ExportData: true,
          ConfirmationModal: true,
        },
      },
    });

    await flushPromises();

    const items = wrapper.findAll(".SalesView__customer-item");
    await items[0].trigger("click");

    expect(wrapper.vm.selectedCustomers).toContainEqual(mockCustomers[0]);
    expect(wrapper.vm.salesCustomers.length).toBe(mockCustomers.length - 1);
  });

  it("selectAllCustomers flytter alle filtrerede kunder til selectedCustomers", async () => {
    const wrapper = mount(SalesView, {
      global: {
        stubs: {
          RouterLink: true,
          BreadcrumbsComp: true,
          SaleTable: true,
          Dropdown: true,
          SearchBar: true,
          CalendarComp: true,
          CustomerName: true,
          ExportData: true,
          ConfirmationModal: true,
        },
      },
    });

    await flushPromises();

    await wrapper.find(".SalesView__button").trigger("click");

    expect(wrapper.vm.selectedCustomers.length).toBe(mockCustomers.length);
    expect(wrapper.vm.salesCustomers.length).toBe(0);
  });

  it("removeAllCustomers flytter alle kunder tilbage til salesCustomers", async () => {
    const wrapper = mount(SalesView, {
      global: {
        stubs: {
          RouterLink: true,
          BreadcrumbsComp: true,
          SaleTable: true,
          Dropdown: true,
          SearchBar: true,
          CalendarComp: true,
          CustomerName: true,
          ExportData: true,
          ConfirmationModal: true,
        },
      },
    });

    await flushPromises();

    wrapper.vm.selectedCustomers.push(mockCustomers[0]);
    wrapper.vm.removeAllCustomers();

    expect(wrapper.vm.selectedCustomers.length).toBe(0);
    expect(wrapper.vm.salesCustomers.length).toBe(mockCustomers.length);
  });

  it("anonymize gør kunderne anonymiserede", async () => {
    const wrapper = mount(SalesView, {
      global: {
        stubs: {
          RouterLink: true,
          BreadcrumbsComp: true,
          SaleTable: true,
          Dropdown: true,
          SearchBar: true,
          CalendarComp: true,
          CustomerName: true,
          ExportData: true,
          ConfirmationModal: true,
        },
      },
    });

    expect(wrapper.vm.showId).toBe(false);
    expect(wrapper.vm.clicked).toBe(false);
    expect(wrapper.vm.confirm).toBe(false);

    wrapper.vm.anonymize();
    expect(wrapper.vm.clicked).toBe(true);
    expect(wrapper.vm.showId).toBe(true);

    wrapper.vm.anonymize();
    expect(wrapper.vm.confirm).toBe(true);
  });

  it("showCustomerData henter selectedCustomers data og viser tabellen for de valgte kunder", async () => {
    const wrapper = mount(SalesView, {
      global: {
        stubs: {
          RouterLink: true,
          BreadcrumbsComp: true,
          SaleTable: true,
          Dropdown: true,
          SearchBar: true,
          CalendarComp: true,
          CustomerName: true,
          ExportData: true,
          ConfirmationModal: true,
        },
      },
    });

    await flushPromises();

    wrapper.vm.selectedCustomers.push(mockCustomers[0]);
    await wrapper.vm.showCustomerData();

    expect(getSelectedCustomers).toHaveBeenCalledWith([1]);
    expect(wrapper.vm.customerTableData).toEqual(mockCustomers);
  });

  it("pagination håndterer sider korrekt", async () => {
    const manyCustomers = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Kunde ${i + 1}`,
      numberOfCars: i * 10,
      archived_at: "2025-01-01"
    }));
    getCustomers.mockResolvedValue(manyCustomers);
    getSelectedCustomers.mockResolvedValue(manyCustomers);

    const wrapper = mount(SalesView, {
      global: {
        stubs: {
          SaleTable: true,
          Dropdown: true,
          SearchBar: true,
          CalendarComp: true,
          ExportData: true,
          ConfirmationModal: true,
          BreadcrumbsComp: true,
        },
      },
    });

    await flushPromises();

    wrapper.vm.selectedCustomers.push(...manyCustomers);

    await wrapper.vm.showCustomerData();

    expect(wrapper.vm.selectedCurrentPage).toBe(1);
    expect(wrapper.vm.paginatedTableData.length).toBe(10);

    wrapper.vm.nextSelectedPage();
    expect(wrapper.vm.selectedCurrentPage).toBe(2);
    expect(wrapper.vm.paginatedTableData.length).toBe(10);

    wrapper.vm.nextSelectedPage();
    expect(wrapper.vm.selectedCurrentPage).toBe(3);
    expect(wrapper.vm.paginatedTableData.length).toBe(5);

    wrapper.vm.prevSelectedPage();
    expect(wrapper.vm.selectedCurrentPage).toBe(2);
    expect(wrapper.vm.paginatedTableData.length).toBe(10);

    wrapper.vm.resetSelectedPage();
    expect(wrapper.vm.selectedCurrentPage).toBe(1);
    expect(wrapper.vm.paginatedTableData.length).toBe(10);
  });
});