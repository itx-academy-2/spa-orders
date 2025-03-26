import { screen } from "@testing-library/react";

import DashboardMetricsSkeleton from "@/pages/dashboard/dashboard-metrics/components/dashboard-metrics-skeleton/DashboardMetricsSkeleton";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

const barHeights = [160, 425, 120, 280, 340];

describe("DashboardMetricsSkeleton", () => {
  beforeEach(() => {
    renderWithProviders(<DashboardMetricsSkeleton />);
  });

  test("should render the skeleton component", () => {
    const skeletonElement = screen.getByTestId("DashboardMetricsSkeleton");

    expect(skeletonElement).toBeInTheDocument();
  });

  test("should render the header skeleton", () => {
    const headerSkeleton = screen.getByText((_, element) => {
      const skeletonConditional =
        !!element?.classList.contains("MuiSkeleton-root") &&
        (element as HTMLElement).style.width === "310px";

      return skeletonConditional;
    });

    expect(headerSkeleton).toBeInTheDocument();
  });

  test("should render the correct number of bar skeletons", () => {
    const barSkeletons = screen.getAllByText((_, element) => {
      const skeletonBarsConditional =
        !!element?.classList.contains("MuiSkeleton-root") &&
        (element as HTMLElement).style.width === "160px";

      return skeletonBarsConditional;
    });

    expect(barSkeletons).toHaveLength(10);
  });

  test("should render bar skeletons with correct heights", () => {
    barHeights.forEach((height) => {
      const barSkeleton = screen.getByText((_, element) => {
        const skeletonHeights =
          !!element?.classList.contains("MuiSkeleton-root") &&
          (element as HTMLElement).style.height === `${height}px`;

        return skeletonHeights;
      });

      expect(barSkeleton).toBeInTheDocument();
    });
  });
});
