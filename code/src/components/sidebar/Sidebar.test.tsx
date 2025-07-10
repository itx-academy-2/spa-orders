import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: jest.fn()
  };
});

describe("Sidebar", () => {
  const mockedUseNavigate = useNavigate as jest.Mock;

  beforeEach(() => {
    mockedUseNavigate.mockReset();
  });

  it("should have the active item based on current URL", () => {
    render(
      <MemoryRouter initialEntries={["/user/wishlist"]}>
        <Sidebar />
      </MemoryRouter>
    );

    const wishlistButton = screen.getByRole("button", { name: "My Wishlist" });
    expect(wishlistButton).toBeInTheDocument();

    const profileButton = screen.getByRole("button", { name: "Profile" });
    expect(profileButton).toBeInTheDocument();
  });

  it("should call navigate with correct path on item click", () => {
    const mockNavigate = jest.fn();
    mockedUseNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter initialEntries={["/user/profile"]}>
        <Sidebar />
      </MemoryRouter>
    );

    const viewHistoryButton = screen.getByRole("button", {
      name: "View History"
    });
    fireEvent.click(viewHistoryButton);

    expect(mockNavigate).toHaveBeenCalledWith("/user-cabinet/view-history");
  });
});
