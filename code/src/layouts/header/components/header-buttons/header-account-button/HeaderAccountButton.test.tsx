import { screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import HeaderAccountButton from "@/layouts/header/components/header-buttons/header-account-button/HeaderAccountButton";

import { AppMenuProps, MenuItem } from "@/components/app-menu/AppMenu.types";

import { useGetUserPhotoQuery } from "@/store/api/userProfileApi";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

jest.mock("@/store/api/userProfileApi", () => ({
  useGetUserPhotoQuery: jest.fn()
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

const mockedPhoto = "https://example.com/photo.jpg";

const mockAndRender = (data?: { photo: string | null }) => {
  (useGetUserPhotoQuery as jest.Mock).mockReturnValue({
    data: data
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
    mockAndRender({ photo: mockedPhoto });

    const photo = screen.getByTestId(
      "header-account-photo"
    ) as HTMLImageElement;

    expect(photo).toBeInTheDocument();
    expect(photo.src).toBe(mockedPhoto);
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

  it("should not render the photo when no photo is provided", () => {
    mockAndRender({ photo: null });

    const photo = screen.queryByTestId("header-account-photo");
    expect(photo).not.toBeInTheDocument();
  });
});
