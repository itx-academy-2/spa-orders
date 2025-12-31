import { render, screen } from "@testing-library/react";
import ReserveButton from "@/pages/product-details/components/reserve-button/ReserveButton";

describe("ReserveButton", () => {
  test("renders a button", () => {
    render(
      <ReserveButton
        isReserved={false}
        isLoading={false}
        onToggle={jest.fn()}
      />
    );

    const reserveButton = screen.getByRole("button");
    expect(reserveButton).toBeInTheDocument();
  });
});
