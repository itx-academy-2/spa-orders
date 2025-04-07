import HelpCenterAccordionItemSkeleton from "@/pages/help-center/components/help-cener-accordion-item/components/HelpCenterAccordionItemSkeleton";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

let container: HTMLElement;

describe("HelpCenterAccordionItemSkeleton", () => {
  beforeEach(() => {
    const renderResult = renderWithProviders(
      <HelpCenterAccordionItemSkeleton />
    );
    container = renderResult.container;
  });

  test("renders three skeleton items", () => {
    const skeletonElements = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletonElements).toHaveLength(3);
  });

  test("renders skeleton items with the rectangular variant", () => {
    const rectangularSkeletons = container.querySelectorAll(
      ".MuiSkeleton-rectangular"
    );
    expect(rectangularSkeletons).toHaveLength(3);
  });
});
