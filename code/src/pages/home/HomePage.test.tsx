import { render, screen } from "@testing-library/react";

import HomePage from "@/pages/home/HomePage";

jest.mock("@/containers/best-sellers/BestSellers", () =>
  jest.fn(() => <div>BestSellers</div>)
);
jest.mock("@/containers/intro-banner/IntroBanner", () =>
  jest.fn(() => <div>IntroBanner</div>)
);
jest.mock("@/containers/subintro/Subintro", () =>
  jest.fn(() => <div>Subintro</div>)
);
jest.mock("@/containers/category-section/CategorySection", () =>
  jest.fn(() => <div>CategorySection</div>)
);
jest.mock("@/containers/call-to-action/CallToAction", () =>
  jest.fn(() => <div>CallToAction</div>)
);

describe("Test HomePage", () => {
  test("Should render all of the page components", () => {
    render(<HomePage />);

    const bestSellersSections = screen.getByText("BestSellers");
    const introBanner = screen.getByText("IntroBanner");
    const subIntro = screen.getByText("Subintro");
    const categorySection = screen.getByText("CategorySection");
    const callToActionSection = screen.getByText("CallToAction");

    expect(bestSellersSections).toBeInTheDocument();
    expect(introBanner).toBeInTheDocument();
    expect(subIntro).toBeInTheDocument();
    expect(categorySection).toBeInTheDocument();
    expect(callToActionSection).toBeInTheDocument();
  });
});
