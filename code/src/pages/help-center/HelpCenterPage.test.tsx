import { screen } from "@testing-library/react";

import HelpCenterPage from "@/pages/help-center/HelpCenterPage";
import { useGetArticlesTitleQuery } from "@/store/api/articlesApi";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

jest.mock("@/store/api/articlesApi", () => ({
  useGetArticlesTitleQuery: jest.fn()
}));

jest.mock(
  "@/pages/help-center/components/help-cener-accordion-item/HelpCenterAccordionItem",
  () => ({
    __esModule: true,
    default: () => <div data-testid="help-center-accordion-item" />
  })
);

jest.mock(
  "@/pages/help-center/components/help-center-skeleton/HelpCenterSkeleton",
  () => ({
    __esModule: true,
    default: () => <div data-testid="help-center-skeleton" />
  })
);

describe("HelpCenterPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render the HelpCenterPage component", () => {
    (useGetArticlesTitleQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { content: [{ id: "1", title: "Test Article" }] }
    });

    renderWithProviders(<HelpCenterPage />);

    const helpCenterPage = screen.getByTestId("help-center-page");

    expect(helpCenterPage).toBeInTheDocument();
  });

  test("should render the title with the correct translation key", () => {
    (useGetArticlesTitleQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { content: [{ id: "1", title: "Test Article" }] }
    });

    renderWithProviders(<HelpCenterPage />);

    const titleElement = screen.getByText("helpCenter.title");

    expect(titleElement).toBeInTheDocument();
  });

  test("should render search input", () => {
    (useGetArticlesTitleQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { content: [{ id: "1", title: "Test Article" }] }
    });

    renderWithProviders(<HelpCenterPage />);

    const input = screen.getByTestId("help-center-search-input");

    expect(input).toBeInTheDocument();
  });

  test("should render accordion item when articles are loaded", () => {
    (useGetArticlesTitleQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      data: { content: [{ id: "1", title: "Test Article" }] }
    });

    renderWithProviders(<HelpCenterPage />);

    const accordionItem = screen.getByTestId("help-center-accordion-item");

    expect(accordionItem).toBeInTheDocument();
  });

  test("should render skeleton when articles are loading", () => {
    (useGetArticlesTitleQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      data: null
    });

    renderWithProviders(<HelpCenterPage />);

    const skeleton = screen.getByTestId("help-center-skeleton");

    expect(skeleton).toBeInTheDocument();
  });
});
