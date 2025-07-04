import { screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import HeaderAccountButton from "@/layouts/header/components/header-buttons/header-account-button/HeaderAccountButton";

import { AppMenuProps, MenuItem } from "@/components/app-menu/AppMenu.types";

import { useGetUserInfoQuery } from "@/store/api/userProfileApi";
import { RTKQueryMockState } from "@/types/common";
import { UserResponse } from "@/types/user.types";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

jest.mock("@/store/api/userProfileApi", () => ({
  useGetUserInfoQuery: jest.fn()
}));
jest.mock("@/components/app-menu/AppMenu", () => ({
  __esModule: true,
  default: ({ open, onClose, items }: AppMenuProps) =>
    open ? (
      <div data-testid="menu">
        {items.map((item: MenuItem, index: number) => (
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

const defaultArgs: RTKQueryMockState<UserResponse> = {
  data: null,
  isError: false,
  isLoading: false
};
const mockData = {
  data: { photo: "https://example.com/photo.jpg" }
};

const mockAndRender = (args?: RTKQueryMockState<Partial<UserResponse>>) => {
  (useGetUserInfoQuery as jest.Mock).mockReturnValue({
    ...defaultArgs,
    ...args
  });

  renderWithProviders(<HeaderAccountButton />);
};

describe("HeaderAccountButton", () => {
  it("should render HeaderAccountButton", () => {
    mockAndRender();
    const accountButton = screen.getByTestId("header-account-button");
    expect(accountButton).toBeInTheDocument();
  });

  it("should render HeaderAccountButton with img", () => {
    mockAndRender(mockData);

    const photo = screen.getByTestId("header-account-photo");
    expect(photo).toBeInTheDocument();
    expect(photo).toHaveAttribute("src", mockData.data.photo);
  });

  it("should open menu and close when menuItem is clicked", async () => {
    mockAndRender();
    const accountButton = screen.getByTestId("header-account-button");
    expect(screen.queryByTestId("menu")).not.toBeInTheDocument();

    await userEvent.click(accountButton);

    expect(screen.getByTestId("menu")).toBeInTheDocument();
    expect(screen.getByText("header.myProfile")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("menu-item-0"));

    expect(screen.queryByTestId("menu")).not.toBeInTheDocument();
  });
});
