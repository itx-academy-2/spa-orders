import { fireEvent, render, screen } from "@testing-library/react";

import ApplyFiltersButton from "@/pages/products/components/products-filter-buttons/apply-filters-button/ApplyFiltersButton";

describe("ApplyFiltersButton", () => {
  const onClickMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the button with correct text", () => {
    render(<ApplyFiltersButton onClick={onClickMock} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("productsFilter.apply");
  });

  test("calls onClick when button is clicked", () => {
    render(<ApplyFiltersButton onClick={onClickMock} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
