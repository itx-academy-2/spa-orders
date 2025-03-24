interface MockData {
  weeks: string[];
  discountFilter: number[];
  priceWithDiscountFilter: number[];
  filterByCategory: number[];
}

type FormatMessage = (messageDescriptor: { id: string }) => string;

export const getMockData = (formatMessage: FormatMessage): MockData => ({
  weeks: [
    `${formatMessage({ id: "dashboardTabs.metrics.week" })} 1`,
    `${formatMessage({ id: "dashboardTabs.metrics.week" })} 2`,
    `${formatMessage({ id: "dashboardTabs.metrics.week" })} 3`,
    `${formatMessage({ id: "dashboardTabs.metrics.week" })} 4`,
    `${formatMessage({ id: "dashboardTabs.metrics.week" })} 5`
  ],
  discountFilter: [5, 10, 15, 20, 25],
  priceWithDiscountFilter: [3, 6, 9, 12, 15],
  filterByCategory: [2, 4, 6, 8, 10]
});
