import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ApexCharts from "apexcharts";

vi.mock("@/components/Icon.vue", () => ({ default: { template: "<div></div>" } }));
vi.mock("../filter/CalendarComp.vue", () => ({ default: { template: "<div></div>" } }));
vi.mock("../filter/ExportData.vue", () => ({ default: { template: "<div></div>" } }));
vi.mock("../CarBoostTable.vue", () => ({
  default: {
    name: "CarBoostTable",
    props: ["highlightedIds", "showOnlySelected", "hidePagination", "hideCheckbox", "tableInModal"],
    template: "<div class='carboost-table'></div>"
  }
}));
vi.mock("apexcharts", () => ({ default: vi.fn().mockImplementation(() => ({ render: vi.fn(), destroy: vi.fn() })) }));

vi.mock("@/services/historyService", () => ({
  getHistoryCarboost: vi.fn().mockResolvedValue({ history: [] })
}));

import { getHistoryCarboost } from "@/services/historyService";
import ShowCustomerCarboostModal from "@/components/modals/ShowCustomerCarBoostModal.vue";

describe("ShowCustomerCarboostModal.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComp = (props = {}) =>
    mount(ShowCustomerCarboostModal, {
      props: {
        customer: { id: 1, name: "Kunde 1", tendens: "up" },
        ...props
      }
    });

  it("emitter 'close' når handleClose kaldes", async () => {
    const wrapper = mountComp();
    await wrapper.vm.handleClose();
    expect(wrapper.emitted()["close"]).toBeTruthy();
    expect(wrapper.emitted()["close"].length).toBe(1);
  });

  it("onMounted henter history og sætter en værdi", async () => {
    getHistoryCarboost.mockResolvedValueOnce({
      history: [{ id: 1, name: "Kunde 1", archived_at: "2025-12-01", dif_leads: 10 }]
    });

    const wrapper = mountComp();
    await flushPromises();

    expect(getHistoryCarboost).toHaveBeenCalled();
    expect(wrapper.vm.history.length).toBe(1);
    expect(wrapper.vm.history[0].dif_leads).toBe(10);
  });

  it("sletter chart når history er tom", async () => {
    const wrapper = mountComp();
    wrapper.vm.history = [];
    await wrapper.vm.$nextTick();
    expect(ApexCharts.mock.results.length).toBe(0);
  });

  it("viser chart med korrekt data", async () => {
    getHistoryCarboost.mockResolvedValueOnce({
      history: [
        { id: 1, name: "Kunde 1", archived_at: "2025-12-01", dif_leads: 5 },
        { id: 1, name: "Kunde 1", archived_at: "2025-12-02", dif_leads: 10 }
      ]
    });

    const wrapper = mountComp();
    await flushPromises();
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();

    expect(ApexCharts).toHaveBeenCalled();
    const chartInstance = ApexCharts.mock.results[0].value;
    expect(chartInstance.render).toHaveBeenCalled();
  });

  it("tendensDown er true hvis customer.tendens = 'down'", () => {
    const wrapper = mountComp({ customer: { id: 1, name: "Kunde 1", tendens: "down" } });
    expect(wrapper.vm.tendensDown).toBe(true);
  });

  it("tendensDown er false hvis customer.tendens != 'down'", () => {
    const wrapper = mountComp({ customer: { id: 1, name: "Kunde 1", tendens: "up" } });
    expect(wrapper.vm.tendensDown).toBe(false);
  });

  it("lastUpdated returnerer korrekt dato", async () => {
    getHistoryCarboost.mockResolvedValueOnce({
      history: [
        { id: 1, name: "Kunde 1", archived_at: "2025-12-02", dif_leads: 10 },
        { id: 1, name: "Kunde 1", archived_at: "2025-12-01", dif_leads: 5 }
      ]
    });

    const wrapper = mountComp();
    await flushPromises();
    expect(wrapper.vm.lastUpdated).toBe(new Date("2025-12-02").toLocaleDateString("da-DK"));
  });

  it("lastUpdated returnerer '-' hvis history er tom", () => {
    const wrapper = mountComp({ customer: { id: 1, name: "Kunde 1" } });
    wrapper.vm.history = [];
    expect(wrapper.vm.lastUpdated).toBe("-");
  });

  it("viser alert når tendensDown = true", async () => {
    const wrapper = mountComp({ customer: { id: 1, name: "Kunde 1", tendens: "down" } });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".show-customer-carboost-modal__topbar-alert").exists()).toBe(true);
  });

  it("viser ikke alert når tendensDown = false", async () => {
    const wrapper = mountComp({ customer: { id: 1, name: "Kunde 1", tendens: "up" } });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".show-customer-carboost-modal__topbar-alert").exists()).toBe(false);
  });

  it("CarBoostTable får korrekte props", () => {
    const wrapper = mountComp();
    const table = wrapper.findComponent({ name: "CarBoostTable" });
    expect(table.exists()).toBe(true);
    expect(table.props("highlightedIds")).toEqual([1]);
    expect(table.props("showOnlySelected")).toBe(true);
    expect(table.props("hidePagination")).toBe(true);
    expect(table.props("hideCheckbox")).toBe(true);
    expect(table.props("tableInModal")).toBe(true);
  });
});