import { screen } from "@testing-library/react";

import HelpCenterPage from "@/pages/help-center/HelpCenterPage";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

jest.mock(
  "@/pages/help-center/components/help-center-accordion/HelpCenterAccordion",
  () => ({
    __esModule: true,
    default: () => <div data-testid="help-center-accordion" />
  })
);

describe("HelpCenterPage", () => {
  test("should render the HelpCenterPage component", () => {
    const { getByTestId } = renderWithProviders(<HelpCenterPage />);

    const helpCenterPage = getByTestId("help-center-page");
    expect(helpCenterPage).toBeInTheDocument();
  });

  test("should render the title with the correct translation key", () => {
    const { getByText } = renderWithProviders(<HelpCenterPage />);

    const titleElement = getByText("helpCenter.title");
    expect(titleElement).toBeInTheDocument();
  });

  test("Should render search input", () => {
    renderWithProviders(<HelpCenterPage />);

    const input = screen.getByTestId("help-center-search-input");
    expect(input).toBeInTheDocument();
  });

  test("Should render accordion", () => {
    renderWithProviders(<HelpCenterPage />);

    const input = screen.getByTestId("help-center-accordion");
    expect(input).toBeInTheDocument();
  });
});
