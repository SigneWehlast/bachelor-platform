import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import Dropdown from "@/components/filter/Dropdown.vue";
import Icon from "@/components/Icon.vue";

describe("Dropdown.vue", () => {
  const options = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    "Option 3"
  ];

  it("skal toggle mellem åbne og lukke dropdown", async () => {
    const wrapper = mount(Dropdown, { props: { options } });
    expect(wrapper.find("ul").exists()).toBe(false);

    await wrapper.trigger("click");
    expect(wrapper.find("ul").exists()).toBe(true);

    await wrapper.trigger("click");
    expect(wrapper.find("ul").exists()).toBe(false);
  });

  it("viser label korrekt når der ikke er valgt en option", () => {
    const wrapper = mount(Dropdown, { props: { options, label: "Vælg" } });
    expect(wrapper.text()).toContain("Vælg");
  });

  it("viser valgt label", () => {
    const wrapper = mount(Dropdown, { props: { options, modelValue: "1" } });
    expect(wrapper.text()).toContain("Option 1");

    const wrapper2 = mount(Dropdown, { props: { options, modelValue: "Option 3" } });
    expect(wrapper2.text()).toContain("Option 3");
  });

  it("sætter selectedPrefix korrekt", () => {
    const wrapper = mount(Dropdown, { props: { options, modelValue: "1", selectedPrefix: "Valgt" } });
    expect(wrapper.text()).toContain("Valgt:  Option 1");
  });

  it("sætter 'update:modelValue' for en mulig option", async () => {
    const wrapper = mount(Dropdown, { props: { options } });
    await wrapper.find(".dropdown").trigger("click");

    const items = wrapper.findAll("li");
    expect(items.length).toBe(options.length);

    await items[0].trigger("click");
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([options[0].value]);
  });
  
  it("disabled options kan ikke vælges", async () => {
    const wrapper = mount(Dropdown, { props: { options, disableOptions: ["1"] } });

    await wrapper.find(".dropdown").trigger("click");
    const items = wrapper.findAll("li");
    await items[0].trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    const icon = wrapper.find(".dropdown-options");
    expect(icon.exists()).toBe(true);
});


  it("getLabel returnerer den rigtige label", () => {
    const wrapper = mount(Dropdown, { props: { options } });
    expect(wrapper.vm.getLabel(options[0])).toBe("Option 1");
    expect(wrapper.vm.getLabel(options[2])).toBe("Option 3");
  });

  it("ikonet ændre sig korrekt alt efter om dropdown er åben eller lukket", async () => {
    const wrapper = mount(Dropdown, { props: { options } });
    const icon = wrapper.findComponent(Icon);

    expect(icon.props("name")).toBe("ChevronDoubleDown");

    await wrapper.trigger("click");
    expect(wrapper.findComponent(Icon).props("name")).toBe("ChevronDoubleUp");
  });
});
