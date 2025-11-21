import { fireEvent, render, screen } from "@testing-library/react";

import ResetIcon from "@/pages/products/components/products-filter-buttons/reset-icon/ResetIcon";

describe("ResetIcon", () => {
  const onClickMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when activeFiltersCount is 0", () => {
    const { container } = render(<ResetIcon activeFiltersCount={0} onClick={onClickMock} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders icon with badge when activeFiltersCount > 0", () => {
    render(<ResetIcon activeFiltersCount={3} onClick={onClickMock} />);
    
    const badge = screen.getByText("3");
    expect(badge).toBeInTheDocument();

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  test("calls onClick when icon button is clicked", () => {
    render(<ResetIcon activeFiltersCount={2} onClick={onClickMock} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
