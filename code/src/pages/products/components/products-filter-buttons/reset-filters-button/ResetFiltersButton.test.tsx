import { fireEvent, render, screen } from "@testing-library/react";

import ResetFiltersButton from "@/pages/products/components/products-filter-buttons/reset-filters-button/ResetFiltersButton";

describe("ResetFiltersButton", () => {
  const onClickMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the button with correct text", () => {
    render(<ResetFiltersButton onClick={onClickMock} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("productsFilter.reset");
  });

  test("calls onClick when button is clicked", () => {
    render(<ResetFiltersButton onClick={onClickMock} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
