import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import DashboardMetricsPage from "@/pages/dashboard/dashboard-metrics/DashboardMetricsPage";

if (typeof global.ResizeObserver === "undefined") {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

const messages = {
  "dashboardTabs.metrics.discount": "Discount",
  "dashboardTabs.metrics.discountSubtitle": "Discount Subtitle",
  "dashboardTabs.metrics.priceWithDiscount": "Price With Discount",
  "dashboardTabs.metrics.priceDiscountSubtitle": "Price Discount Subtitle",
  "dashboardTabs.metrics.category": "Category",
  "dashboardTabs.metrics.categorySubtitle": "Category Subtitle",
  "dashboardTabs.metrics.week": "Week"
};

describe("DashboardMetricsPage", () => {
  test("renders all sections with correct headings", () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <DashboardMetricsPage />
      </IntlProvider>
    );

    expect(
      screen.getByText("dashboardTabs.metrics.discount")
    ).toBeInTheDocument();
    expect(
      screen.getByText("dashboardTabs.metrics.priceWithDiscount")
    ).toBeInTheDocument();
    expect(
      screen.getByText("dashboardTabs.metrics.category")
    ).toBeInTheDocument();
  });

  test("renders three charts", () => {
    const { container } = render(
      <IntlProvider locale="en" messages={messages}>
        <DashboardMetricsPage />
      </IntlProvider>
    );

    const canvases = container.querySelectorAll("canvas");

    expect(canvases.length).toBe(3);
  });
});
