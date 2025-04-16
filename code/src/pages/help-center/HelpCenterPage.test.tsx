import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ChangeEvent, ReactNode } from "react";

import HelpCenterPage from "@/pages/help-center/HelpCenterPage";

jest.mock("react-intl", () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => {
      const messages: Record<string, string> = {
        "helpCenter.searchbar.placeholder": "Search...",
        "helpCenter.title": "Help Center Title",
        "helpCenter.noResults": "No results found"
      };
      return messages[id] || id;
    }
  })
}));

jest.mock("@/context/i18n/I18nProvider", () => ({
  useLocaleContext: () => ({ locale: "en" })
}));

jest.mock(
  "@/hooks/use-debounced-value/useDebouncedValue",
  () =>
    <T,>(value: T): T =>
      value
);

const mockGetArticlesTitleQuery = jest.fn();
const mockSearchArticlesQuery = jest.fn();

jest.mock("@/store/api/articlesApi", () => ({
  useGetArticlesTitleQuery: (
    ...args: Parameters<typeof mockGetArticlesTitleQuery>
  ) => mockGetArticlesTitleQuery(...args),
  useSearchArticlesQuery: (
    ...args: Parameters<typeof mockSearchArticlesQuery>
  ) => mockSearchArticlesQuery(...args)
}));

jest.mock("@/layouts/page-wrapper/PageWrapper", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="page-wrapper">{children}</div>
  )
}));

jest.mock("@/components/app-box/AppBox", () => ({
  __esModule: true,
  default: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [x: string]: unknown;
  }) => <div {...props}>{children}</div>
}));

jest.mock("@/components/app-search-input/AppSearchInput", () => ({
  __esModule: true,
  default: (props: {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    onSearch: () => void;
    onClear: () => void;
  }) => (
    <div>
      <input
        data-testid="help-center-search-input"
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
      <button data-testid="search-button" onClick={props.onSearch}>
        Search
      </button>
      <button data-testid="clear-button" onClick={props.onClear}>
        Clear
      </button>
    </div>
  )
}));

jest.mock("@/components/app-typography/AppTypography", () => ({
  __esModule: true,
  default: (props: { translationKey: string }) => (
    <div>{props.translationKey}</div>
  )
}));

jest.mock(
  "@/pages/help-center/components/help-center-skeleton/HelpCenterSkeleton",
  () => ({
    __esModule: true,
    default: () => <div data-testid="articles-skeleton">Loading...</div>
  })
);

jest.mock(
  "@/pages/help-center/components/help-cener-accordion-item/HelpCenterAccordionItem",
  () => ({
    __esModule: true,
    default: (props: { article: { id: number; title: string } }) => (
      <div
        data-testid="accordion-item"
        id={`helpcenter-article-${props.article.id}`}
      >
        {props.article.title}
      </div>
    )
  })
);

jest.mock(
  "@/components/help-center-search-dropdown/help-center-search-input-dropdown/HelpCenterSearchInputDropdown",
  () => ({
    __esModule: true,
    default: (props: {
      onResultClick: (id: number) => void;
      searchResults: { id: number; title: string }[];
    }) => (
      <div
        data-testid="search-input-dropdown"
        onClick={() => props.onResultClick(props.searchResults[0].id)}
      >
        Dropdown
      </div>
    )
  })
);

const articles = [
  { id: 1, title: "Article 1" },
  { id: 2, title: "Article 2" }
];
jest.mock("./hooks/use-suggested-product/useSuggestedProduct", () => ({
  __esModule: true,
  default: () => ({
    data: { data: null, isLoading: false },
    userHasVisitsInfo: false
  })
}));

describe("HelpCenterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the basic page structure with title and search input", () => {
    mockGetArticlesTitleQuery.mockReturnValue({
      data: { content: [] },
      isLoading: false
    });

    mockSearchArticlesQuery.mockReturnValue({ data: [], isLoading: false });

    render(<HelpCenterPage />);

    expect(screen.getByTestId("page-wrapper")).toBeInTheDocument();

    expect(screen.getByTestId("help-center-page")).toBeInTheDocument();

    expect(screen.getByTestId("help-center-search-input")).toBeInTheDocument();

    expect(screen.getByText("helpCenter.title")).toBeInTheDocument();
  });

  test("renders loading state for default articles", () => {
    mockGetArticlesTitleQuery.mockReturnValue({ data: null, isLoading: true });

    mockSearchArticlesQuery.mockReturnValue({ data: [], isLoading: false });

    render(<HelpCenterPage />);

    expect(screen.getByTestId("articles-skeleton")).toBeInTheDocument();
  });

  test("renders default articles when available", () => {
    mockGetArticlesTitleQuery.mockReturnValue({
      data: { content: articles },
      isLoading: false
    });

    mockSearchArticlesQuery.mockReturnValue({ data: [], isLoading: false });

    render(<HelpCenterPage />);

    expect(screen.getByText("Article 1")).toBeInTheDocument();

    expect(screen.getByText("Article 2")).toBeInTheDocument();

    expect(document.getElementById("helpcenter-article-1")).toBeInTheDocument();

    expect(document.getElementById("helpcenter-article-2")).toBeInTheDocument();
  });

  describe("Search functionality", () => {
    test("shows loading skeleton in search dropdown when search query is loading", () => {
      mockGetArticlesTitleQuery.mockReturnValue({
        data: { content: [] },
        isLoading: false
      });
      mockSearchArticlesQuery.mockReturnValue({ data: [], isLoading: true });

      render(<HelpCenterPage />);

      const searchInput = screen.getByTestId(
        "help-center-search-input"
      ) as HTMLInputElement;

      fireEvent.change(searchInput, { target: { value: "abc" } });

      fireEvent.click(screen.getByTestId("search-button"));

      expect(screen.getByTestId("articles-skeleton")).toBeInTheDocument();
    });

    test("shows search dropdown with results when search query returns articles", () => {
      mockGetArticlesTitleQuery.mockReturnValue({
        data: { content: [] },
        isLoading: false
      });

      const searchResults = [{ id: 3, title: "Search Result 1" }];

      mockSearchArticlesQuery.mockReturnValue({
        data: searchResults,
        isLoading: false
      });

      render(<HelpCenterPage />);

      const searchInput = screen.getByTestId(
        "help-center-search-input"
      ) as HTMLInputElement;

      fireEvent.change(searchInput, { target: { value: "search" } });

      fireEvent.click(screen.getByTestId("search-button"));

      expect(screen.getByTestId("search-input-dropdown")).toBeInTheDocument();
    });
  });

  test("clears search input when clear button is clicked", () => {
    mockGetArticlesTitleQuery.mockReturnValue({
      data: { content: [] },
      isLoading: false
    });

    mockSearchArticlesQuery.mockReturnValue({ data: [], isLoading: false });

    render(<HelpCenterPage />);

    const searchInput = screen.getByTestId(
      "help-center-search-input"
    ) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: "test" } });

    expect(searchInput.value).toBe("test");

    const clearButton = screen.getByTestId("clear-button");

    fireEvent.click(clearButton);

    expect(searchInput.value).toBe("");
  });

  test("selecting a search result scrolls to the corresponding article", async () => {
    jest.useFakeTimers();

    const articles = [{ id: 1, title: "Article 1" }];

    mockGetArticlesTitleQuery.mockReturnValue({
      data: { content: articles },
      isLoading: false
    });

    const searchResults = [{ id: 1, title: "Article 1" }];

    mockSearchArticlesQuery.mockReturnValue({
      data: searchResults,
      isLoading: false
    });

    const scrollIntoViewMock = jest.fn();

    document.getElementById = jest.fn().mockReturnValue({
      scrollIntoView: scrollIntoViewMock
    });

    render(<HelpCenterPage />);

    const searchInput = screen.getByTestId(
      "help-center-search-input"
    ) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: "Article" } });

    fireEvent.click(screen.getByTestId("search-button"));

    const dropdown = screen.getByTestId("search-input-dropdown");

    fireEvent.click(dropdown);

    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start"
      });
    });

    jest.useRealTimers();
  });
});
