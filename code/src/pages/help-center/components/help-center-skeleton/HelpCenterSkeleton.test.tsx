import { render } from "@testing-library/react";

import HelpCenterArticlesSkeleton from "@/pages/help-center/components/help-center-skeleton/HelpCenterSkeleton";

describe("HelpCenterArticlesSkeleton", () => {
  test("renders 8 Skeleton components", () => {
    const { container } = render(<HelpCenterArticlesSkeleton />);

    const skeletonElements = container.querySelectorAll(".MuiSkeleton-root");

    expect(skeletonElements.length).toBe(8);
  });

  test("applies correct styles to each Skeleton", () => {
    const { container } = render(<HelpCenterArticlesSkeleton />);

    const skeletonElements = container.querySelectorAll(".MuiSkeleton-root");

    skeletonElements.forEach((el) => {
      expect(el).toHaveStyle({ height: "50px", marginBottom: "6px" });
    });
  });
});
