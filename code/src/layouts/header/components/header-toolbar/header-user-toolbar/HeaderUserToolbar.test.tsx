import { render, screen } from "@testing-library/react";

import HeaderUserToolbar from "@/layouts/header/components/header-toolbar/header-user-toolbar/HeaderUserToolbar";

jest.mock(
  "@/layouts/header/components/header-buttons/header-cart-button/HeaderCartButton",
  () => ({
    __esModule: true,
    default: () => <div>Cart Button</div>
  })
);
jest.mock(
  "@/layouts/header/components/header-buttons/header-account-button/HeaderAccountButton",
  () => ({
    __esModule: true,
    default: () => <div>Account Button</div>
  })
);

describe("Test HeaderUserToolbar", () => {
  it("should render the cart button and account button", () => {
    render(<HeaderUserToolbar />);

    const cartButton = screen.getByText("Cart Button");
    const accountButton = screen.getByText("Account Button");

    expect(cartButton).toBeInTheDocument();
    expect(accountButton).toBeInTheDocument();
  });
});
