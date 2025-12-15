import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ConversionsDataCars from "@/components/dashboard/ConversionsDataCars.vue";

vi.mock("@/services/customerStatsService", () => ({
  getCustomerStats: vi.fn()
}));

import { getCustomerStats } from "@/services/customerStatsService";

const mockCustomers = [
  {
    numberOfCars: 16,
    leads: 42,
    carboostConversions: 24,
    totalBudget: 5000
  },
  {
    numberOfCars: 24,
    leads: 64,
    carboostConversions: 34,
    totalBudget: 6000
  },
  {
    numberOfCars: 120,
    leads: 340,
    carboostConversions: 124,
    totalBudget: 10000
  }
];

const mountComp = () => mount(ConversionsDataCars);

describe("ConversionDataCars.vue", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    getCustomerStats.mockResolvedValue(mockCustomers);
  });

  it("henter data på kunderne når komponentet mountes og beregner konverteringer", async () => {
    const wrapper = mountComp();
    await flushPromises();

    expect(getCustomerStats).toHaveBeenCalled();

    const conversions = wrapper.vm.conversionsCars;

    //Laves på kunde 1 og 2, som har biler mellem 0-25
    expect(conversions[0].data).toBe("53");
    expect(conversions[1].data).toBe("29");
    expect(conversions[3].data).toBe("20");
  });

  it("beregner pris pr. bil pr. dag korrekt", async () => {
    const wrapper = mountComp();
    await flushPromises();

    expect(wrapper.vm.conversionsCars[2].data).toBe("9.4");
    expect(wrapper.vm.conversionsCars[2].description).toBe("Lav - god økonomi");
  });

  it("viser 'Ingen data' hvis segment ikke matcher kunder", async () => {
    const wrapper = mountComp();
    await flushPromises();

    wrapper.vm.selectedSegment = "176-200 biler";
    await flushPromises();

    wrapper.vm.conversionsCars.forEach(c => {
      expect(c.data).toBe("0");
      expect(c.description).toBe("Ingen data");
    });
  });

  it("reagerer på ændringer når watchen selectedSegment ændres", async () => {
    const wrapper = mountComp();
    await flushPromises();

    const before = wrapper.vm.conversionsCars[0].data;

    wrapper.vm.selectedSegment = "101-125 biler";
    await flushPromises();

    const after = wrapper.vm.conversionsCars[0].data;

    expect(before).not.toBe(after);
    expect(after).toBe("340");
  });

  it("beregner carboost-andel korrekt", async () => {
    const wrapper = mountComp();
    await flushPromises();

    expect(wrapper.vm.conversionsCars[1].description).toBe("31.9% af totalen");
  });

});
