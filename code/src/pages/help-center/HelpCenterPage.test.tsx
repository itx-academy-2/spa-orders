import { screen } from "@testing-library/react";

import HelpCenterPage from "@/pages/help-center/HelpCenterPage";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

jest.mock("@/store/api/articlesApi", () => ({
  useGetArticlesTitleQuery: () => ({
    data: { content: [{ id: "1", title: "Test Article" }] }
  })
}));

jest.mock(
  "@/pages/help-center/components/help-cener-accordion-item/HelpCenterAccordionItem",
  () => ({
    __esModule: true,
    default: () => <div data-testid="help-center-accordion-item" />
  })
);

describe("HelpCenterPage", () => {
  test("should render the HelpCenterPage component", () => {
    renderWithProviders(<HelpCenterPage />);

    const helpCenterPage = screen.getByTestId("help-center-page");

    expect(helpCenterPage).toBeInTheDocument();
  });

  test("should render the title with the correct translation key", () => {
    renderWithProviders(<HelpCenterPage />);

    const titleElement = screen.getByText("helpCenter.title");

    expect(titleElement).toBeInTheDocument();
  });

  test("should render search input", () => {
    renderWithProviders(<HelpCenterPage />);

    const input = screen.getByTestId("help-center-search-input");

    expect(input).toBeInTheDocument();
  });

  test("should render accordion item", () => {
    renderWithProviders(<HelpCenterPage />);

    const accordionItem = screen.getByTestId("help-center-accordion-item");

    expect(accordionItem).toBeInTheDocument();
  });
});
