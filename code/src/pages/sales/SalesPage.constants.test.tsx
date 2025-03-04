import { isValidElement } from "react";

import { sortSaleOptions } from "@/pages/sales/SalesPage.constants";

describe("SalesPage.constants", () => {
  test("should have the correct shape (value and label) for each option", () => {
    expect(sortSaleOptions.length).toBeGreaterThan(0);

    sortSaleOptions.forEach((option) => {
      expect(option).toHaveProperty("value");
      expect(option).toHaveProperty("label");
    });
  });

  test("should have valid React elements for the label property", () => {
    sortSaleOptions.forEach((option) => {
      expect(isValidElement(option.label)).toBe(true);
    });
  });
});
