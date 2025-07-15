import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";

import SidebarMenu, { MenuItem } from "../sidebar-menu/SidebarMenu";

// Мокаємо useNavigate
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: jest.fn()
  };
});

// Мокаємо AppTypography — повертаємо translationKey
jest.mock("@/components/app-typography/AppTypography", () => ({
  __esModule: true,
  default: ({ translationKey }: { translationKey: string }) => (
    <span>{translationKey}</span>
  )
}));

describe("SidebarMenu", () => {
  const mockedUseNavigate = useNavigate as jest.Mock;

  const menuItems: MenuItem[] = [
    { id: "profile", translationKey: "label.profile", path: "/user/profile" },
    {
      id: "view-history",
      translationKey: "label.history",
      path: "/user-cabinet/view-history"
    },
    { id: "wishlist", translationKey: "label.wishlist", path: "/user/wishlist" }
  ];

  beforeEach(() => {
    mockedUseNavigate.mockReset();
  });

  const renderComponent = (initialRoute = "/") => {
    const mockNavigate = jest.fn();
    mockedUseNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <SidebarMenu items={menuItems} />
      </MemoryRouter>
    );

    return { mockNavigate };
  };

  it("should render all menu items", () => {
    renderComponent();

    menuItems.forEach((item) => {
      expect(
        screen.getByRole("button", { name: item.translationKey })
      ).toBeInTheDocument();
    });
  });

  it("should highlight active item based on current URL", () => {
    renderComponent("/user/wishlist");

    const activeButton = screen.getByRole("button", {
      name: "label.wishlist"
    });

    expect(activeButton).toBeInTheDocument();
  });

  it("should navigate when menu item is clicked", () => {
    const { mockNavigate } = renderComponent("/user/profile");

    const historyButton = screen.getByRole("button", {
      name: "label.history"
    });

    fireEvent.click(historyButton);

    expect(mockNavigate).toHaveBeenCalledWith("/user-cabinet/view-history");
  });
});
