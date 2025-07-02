import { screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import HeaderAccountButton from "@/layouts/header/components/header-buttons/header-account-button/HeaderAccountButton";

import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

jest.mock(
  "@/layouts/header/components/header-buttons/header-account-button/HeaderAccountButton.constants",
  () => ({
    getHeaderMenuList: jest.fn(() => [
      { id: 1, name: "Profile", onClick: jest.fn() }
    ])
  })
);
jest.mock("@/components/app-menu/AppMenu", () => ({
  __esModule: true,
  default: ({ open, onClose, items }: any) =>
    open ? (
      <div data-testid="menu">
        {items.map((item: any, index: number) => (
          <div
            key={index}
            data-testid={`menu-item-${index}`}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    ) : null
}));

describe("HeaderAccountButton", () => {
  beforeEach(() => {
    renderWithProviders(<HeaderAccountButton />);
  });

  it("should render HeaderAccountButton", () => {
    const accountButton = screen.getByTestId("header-account-button");
    expect(accountButton).toBeInTheDocument();
  });

  it("should open menu and close when menuItem is clicked", async () => {
    const accountButton = screen.getByTestId("header-account-button");
    expect(screen.queryByTestId("menu")).not.toBeInTheDocument();

    await userEvent.click(accountButton);

    expect(screen.getByTestId("menu")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("menu-item-0"));

    expect(screen.queryByTestId("menu")).not.toBeInTheDocument();
  });
});
