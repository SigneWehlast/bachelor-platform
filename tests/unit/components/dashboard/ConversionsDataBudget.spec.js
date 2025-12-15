import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ConversionDataBudget from "@/components/dashboard/ConversionsDataBudget.vue";

vi.mock("@/services/customerStatsService", () => ({
  getCustomerStats: vi.fn()
}));

import { getCustomerStats } from "@/services/customerStatsService";

const mockCustomers = [
  {
    totalBudget: 1500,
    leads: 54,
    carboostConversions: 24,
    numberOfCars: 62
  },
  {
    totalBudget: 20000,
    leads: 320,
    carboostConversions: 122,
    numberOfCars: 234
  },
  {
    totalBudget: 1500,
    leads: 102,
    carboostConversions: 42,
    numberOfCars: 54
  }
];

const mountComp = () => mount(ConversionDataBudget);

describe("ConversionDataBudget.vue", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    getCustomerStats.mockResolvedValue(mockCustomers);
  });

  it("henter data på kunderne ved mount af komponentet og opdaterer konverteringer", async () => {
    const wrapper = mountComp();
    await flushPromises();

    expect(getCustomerStats).toHaveBeenCalled();

    expect(wrapper.vm.conversions[0].data).toBe("0");
    expect(wrapper.vm.conversions[0].description).toBe("Ingen data");
  });

  it("beregner konverteringer korrekt for segment 1001 - 2000 kr.", async () => {
    const wrapper = mountComp();
    await flushPromises();

    wrapper.vm.selectedSegment = "1001 - 2000 kr.";
    await flushPromises();

    const conversions = wrapper.vm.conversions;

    // Tager på kunde 1 og 3, som har et budget på 1500 kr.
    expect(conversions[0].data).toBe("78");
    expect(conversions[1].data).toBe("33");
    expect(conversions[3].data).toBe("58");
    expect(conversions[0].description).toBe("(+) Høj konvertering");
    expect(conversions[1].description).toContain("% af totalen");
  });

  it("viser 'Ingen data' hvis intet matcher budget-segment", async () => {
    getCustomerStats.mockResolvedValueOnce([
      {
        totalBudget: 10000,
        leads: 50,
        carboostConversions: 10,
        numberOfCars: 5
      }
    ]);

    const wrapper = mountComp();
    await flushPromises();

    const conversions = wrapper.vm.conversions;

    conversions.forEach(c => {
      expect(c.data).toBe("0");
      expect(c.description).toBe("Ingen data");
    });
  });

  it("reagerer på ændring i watchen med selectedSegment", async () => {
    const wrapper = mountComp();
    await flushPromises();

    const before = wrapper.vm.conversions[0].data;

    wrapper.vm.selectedSegment = "4001+ kr.";
    await flushPromises();

    const after = wrapper.vm.conversions[0].data;

    expect(before).not.toBe(after);
  });

});