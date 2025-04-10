import { fireEvent, render, screen } from "@testing-library/react";

import HelpCenterSearchInputDropdown from "@/components/help-center-search-dropdown/help-center-search-input-dropdown/HelpCenterSearchInputDropdown";

const mockSearchResults = [
  { id: 1, title: "Article One" },
  { id: 2, title: "Article Two" },
  { id: 3, title: "Article Three" }
];

const onResultClick = jest.fn();
const handleCloseDropdown = jest.fn();

test("renders the dropdown with search results", () => {
  render(<HelpCenterSearchInputDropdown searchResults={mockSearchResults} />);

  const dropdownContainer = screen.getByTestId("search-dropdown");

  expect(dropdownContainer).toBeInTheDocument();

  mockSearchResults.forEach((article) => {
    expect(screen.getByText(article.title)).toBeInTheDocument();
  });
});

test("calls onResultClick and handleCloseDropdown when an item is clicked", () => {
  render(
    <HelpCenterSearchInputDropdown
      searchResults={mockSearchResults}
      onResultClick={onResultClick}
      handleCloseDropdown={handleCloseDropdown}
    />
  );

  const firstItem = screen.getByText("Article One");

  fireEvent.click(firstItem);

  expect(onResultClick).toHaveBeenCalledWith(1);

  expect(handleCloseDropdown).toHaveBeenCalled();
});

test("renders without errors if callbacks are not provided", () => {
  render(<HelpCenterSearchInputDropdown searchResults={mockSearchResults} />);

  const dropdownContainer = screen.getByTestId("search-dropdown");

  expect(dropdownContainer).toBeInTheDocument();

  mockSearchResults.forEach((article) => {
    expect(screen.getByText(article.title)).toBeInTheDocument();
  });
});
