import { fireEvent, render, screen } from "@testing-library/react";

import HelpCenterSearchInput from "@/components/help-center-search-input/HelpCenterSearchInput";

jest.mock("react-intl", () => ({
  useIntl: () => ({
    formatMessage: () => "Search..."
  })
}));

const mockHandleOpenDropdown = jest.fn();
const mockHandleCloseDropdown = jest.fn();

jest.mock("@/hooks/use-dropdown/useDropdown", () => ({
  __esModule: true,
  default: () => ({
    isDropdownOpened: true,
    handleOpenDropdown: mockHandleOpenDropdown,
    handleCloseDropdown: mockHandleCloseDropdown
  })
}));

jest.mock("@/hooks/use-on-click-outside/useOnClickOutside", () => ({
  useOnClickOutside: () => {}
}));

jest.mock(
  "@/components/help-center-search-dropdown/help-center-search-dropdown-container/HelpCenterSearchDropdownContainer",
  () => {
    const MockDropdownContainer = () => <div data-testid="search-dropdown" />;
    MockDropdownContainer.displayName = "MockDropdownContainer";
    return MockDropdownContainer;
  }
);

test("renders the input field with placeholder text", () => {
  render(<HelpCenterSearchInput />);

  const inputElement = screen.getByPlaceholderText("Search...");

  expect(inputElement).toBeInTheDocument();
});

test("updates input value on change", () => {
  render(<HelpCenterSearchInput />);

  const inputElement = screen.getByPlaceholderText(
    "Search..."
  ) as HTMLInputElement;

  fireEvent.change(inputElement, { target: { value: "test" } });

  expect(inputElement.value).toBe("test");

  expect(mockHandleOpenDropdown).toHaveBeenCalled();
});

test("does not render dropdown when query length is less than 3", () => {
  render(<HelpCenterSearchInput />);
  const inputElement = screen.getByPlaceholderText(
    "Search..."
  ) as HTMLInputElement;

  fireEvent.change(inputElement, { target: { value: "ab" } });

  expect(screen.queryByTestId("search-dropdown")).not.toBeInTheDocument();
});

test("renders dropdown when query length is 3 or more", () => {
  render(<HelpCenterSearchInput />);
  const inputElement = screen.getByPlaceholderText(
    "Search..."
  ) as HTMLInputElement;

  fireEvent.change(inputElement, { target: { value: "abc" } });

  expect(screen.getByTestId("search-dropdown")).toBeInTheDocument();
});

test("clears input and closes dropdown on clear button click", () => {
  render(<HelpCenterSearchInput />);
  const inputElement = screen.getByPlaceholderText(
    "Search..."
  ) as HTMLInputElement;

  fireEvent.change(inputElement, { target: { value: "abc" } });
  expect(inputElement.value).toBe("abc");

  const buttons = screen.getAllByRole("button");

  fireEvent.click(buttons[0]);

  expect(inputElement.value).toBe("");

  expect(mockHandleCloseDropdown).toHaveBeenCalled();
});
