import { fireEvent, screen, within } from "@testing-library/react";

import { FilterRecordAccordionProps } from "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterAccordion.types";
import FilterRecordAccordion from "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion";

import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

const mockResetFilter = jest.fn();
const sectionCaptionTranslationKey = "translation.key";
const textWithFilterName = `dashboardTabs.orders.filters.clearFilterTooltip/filterName:${sectionCaptionTranslationKey}`;
const filterButtonTestId = `reset-filter-button-${sectionCaptionTranslationKey}`;

const renderFilterRecordAccordion = ({
  isFilterActive,
  defaultExpanded
}: Partial<FilterRecordAccordionProps> = {}) => {
  return renderWithProviders(
    <FilterRecordAccordion
      sectionCaptionTranslationKey={sectionCaptionTranslationKey}
      resetFilter={mockResetFilter}
      isFilterActive={isFilterActive}
      defaultExpanded={defaultExpanded}
    >
      <div>Children</div>
    </FilterRecordAccordion>
  );
};

describe("FilterRecordAccordion", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("does not expand when defaultExpanded is set to false", () => {
    renderFilterRecordAccordion({ defaultExpanded: false });

    const accordionContentWrapper = screen
      .getByTestId("accordion-content-wrapper")
      .closest(".MuiCollapse-root");

    expect(accordionContentWrapper).toHaveStyle({ minHeight: "0px" });
  });

  describe("with default props", () => {
    beforeEach(() => {
      renderFilterRecordAccordion();
    });

    test("is expanded by default", () => {
      const accordionContentWrapper = screen
        .getByTestId("accordion-content-wrapper")
        .closest(".MuiCollapse-root");

      expect(accordionContentWrapper).toHaveStyle({ visibility: "visible" });
    });

    test("does not render active filter indicator when isFilterActive is false", () => {
      const filterIndicatorIcon = screen.queryByTestId("FiberManualRecordIcon");
      expect(filterIndicatorIcon).not.toBeInTheDocument();
    });

    test("renders children content", () => {
      const childrenContent = screen.getByText("Children");
      expect(childrenContent).toBeInTheDocument();
    });

    test("renders section caption", () => {
      const sectionCaption = screen.getByText(sectionCaptionTranslationKey);
      expect(sectionCaption).toBeInTheDocument();
    });
  });

  describe("with isFilterActive equals true", () => {
    beforeEach(() => {
      renderFilterRecordAccordion({ isFilterActive: true });
    });

    test("shows tooltip for reset filter button on hover", async () => {
      const resetFilterButton = screen.getByTestId(filterButtonTestId);
      fireEvent.mouseOver(resetFilterButton);

      const tooltip = await screen.findByText(textWithFilterName);
      expect(tooltip).toBeInTheDocument();
    });

    test("renders active filter indicator", () => {
      const filterIndicatorIcon = screen.getByTestId("FiberManualRecordIcon");
      expect(filterIndicatorIcon).toBeInTheDocument();
    });

    test("calls resetFilter when we click reset filter button", () => {
      const resetFilterButton = screen.getByTestId(filterButtonTestId);
      fireEvent.click(resetFilterButton);

      expect(mockResetFilter).toHaveBeenCalled();
    });
  });

  describe("FilterRecordAccordion toggle tests", () => {
    test("toggles accordion expansion on summary click", () => {
      renderFilterRecordAccordion({ defaultExpanded: true });

      const accordionContentWrapper = screen.getByTestId(
        "accordion-content-wrapper"
      );

      expect(
        within(accordionContentWrapper).getByText("Children")
      ).toBeVisible();

      const summaryElement = screen.getByRole("button", {
        name: /translation.key/i
      });

      fireEvent.click(summaryElement);

      let collapseWrapper =
        accordionContentWrapper.closest(".MuiCollapse-root");

      expect(collapseWrapper).toHaveStyle({ minHeight: "0px" });

      fireEvent.click(summaryElement);

      collapseWrapper = accordionContentWrapper.closest(".MuiCollapse-root");

      expect(collapseWrapper).toHaveStyle({ visibility: "visible" });
    });
  });
});
