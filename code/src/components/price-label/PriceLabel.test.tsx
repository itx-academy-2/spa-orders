import { render, screen } from "@testing-library/react";

import PriceLabel from "@/components/price-label/PriceLabel";

describe("Test PriceLabel component", () => {
  test("Should show both original price and price with discount", () => {
    render(<PriceLabel price={2} priceWithDiscount={2} />);

    const originalPrice = screen.getByTestId("price-label-original-price");
    const discountedPrice = screen.getByTestId("price-label-discounted-price");

    expect(originalPrice).toBeInTheDocument();
    expect(discountedPrice).toBeInTheDocument();
  });

  test("Should show only one price", () => {
    render(<PriceLabel price={2} />);

    const noDiscountPrice = screen.getByTestId("price-label-no-discount");

    expect(noDiscountPrice).toBeInTheDocument();
  });
});
