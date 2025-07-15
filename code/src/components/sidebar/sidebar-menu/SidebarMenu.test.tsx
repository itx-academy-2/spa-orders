import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";

import SidebarMenu, { MenuItem } from "../sidebar-menu/SidebarMenu";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: jest.fn()
  };
});

describe("SidebarMenu", () => {
  const mockedUseNavigate = useNavigate as jest.Mock;

  const menuItems: MenuItem[] = [
    { id: "profile", translationKey: "Profile", path: "/user/profile" },
    {
      id: "view-history",
      translationKey: "View History",
      path: "/user-cabinet/view-history"
    },
    { id: "wishlist", translationKey: "My Wishlist", path: "/user/wishlist" }
  ];

  beforeEach(() => {
    mockedUseNavigate.mockReset();
  });

  const renderAndMock = (route: string = "/") => {
    const mockNavigate = jest.fn();
    mockedUseNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter initialEntries={[route]}>
        <SidebarMenu items={menuItems} />
      </MemoryRouter>
    );

    return { mockNavigate };
  };

  it("should highlight active item based on current URL", () => {
    renderAndMock("/user/wishlist");

    const activeButton = screen.getByRole("button", { name: "My Wishlist" });
    expect(activeButton).toBeInTheDocument();
  });

  it("should navigate when menu item is clicked", () => {
    const { mockNavigate } = renderAndMock("/user/profile");

    const historyButton = screen.getByRole("button", {
      name: "View History"
    });

    fireEvent.click(historyButton);

    expect(mockNavigate).toHaveBeenCalledWith("/user-cabinet/view-history");
  });
});
