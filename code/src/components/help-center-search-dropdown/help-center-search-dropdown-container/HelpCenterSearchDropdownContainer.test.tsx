import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import HelpCenterSearchDropdownContainer from "@/components/help-center-search-dropdown/help-center-search-dropdown-container/HelpCenterSearchDropdownContainer";

import { useGetArticlesIdTitleQuery } from "@/store/api/articlesApi";

jest.mock("@/store/api/articlesApi");

const createMockStore = () =>
  configureStore({
    reducer: () => ({})
  });

const mockData = [{ id: 1, title: "Article 1" }];

test("renders null if query length is less than 3", () => {
  (useGetArticlesIdTitleQuery as jest.Mock).mockReturnValue({
    data: null,
    isLoading: false,
    isError: false
  });

  const store = createMockStore();

  render(
    <Provider store={store}>
      <HelpCenterSearchDropdownContainer query="ab" />
    </Provider>
  );

  expect(screen.queryByTestId("search-dropdown")).not.toBeInTheDocument();
});

test("renders null while loading", () => {
  (useGetArticlesIdTitleQuery as jest.Mock).mockReturnValue({
    data: null,
    isLoading: true,
    isError: false
  });

  const store = createMockStore();

  render(
    <Provider store={store}>
      <HelpCenterSearchDropdownContainer query="query" />
    </Provider>
  );

  expect(screen.queryByTestId("search-dropdown")).not.toBeInTheDocument();
});

test("renders null if there is an error", () => {
  (useGetArticlesIdTitleQuery as jest.Mock).mockReturnValue({
    data: null,
    isLoading: false,
    isError: true
  });

  const store = createMockStore();

  render(
    <Provider store={store}>
      <HelpCenterSearchDropdownContainer query="query" />
    </Provider>
  );

  expect(screen.queryByTestId("search-dropdown")).not.toBeInTheDocument();
});

test("renders HelpCenterSearchInputDropdown when data is available", () => {
  (useGetArticlesIdTitleQuery as jest.Mock).mockReturnValue({
    data: mockData,
    isLoading: false,
    isError: false
  });

  const store = createMockStore();

  render(
    <Provider store={store}>
      <HelpCenterSearchDropdownContainer query="query" />
    </Provider>
  );

  expect(screen.getByTestId("search-dropdown")).toBeInTheDocument();
});
