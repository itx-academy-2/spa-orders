import { render, screen } from "@testing-library/react";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import userEvent from "@testing-library/user-event";

import { AppMenuItemProps } from "@/components/app-menu-item/AppMenuItem.types";
import AppMenu from "@/components/app-menu/AppMenu";
import { MenuItem } from "@/components/app-menu/AppMenu.types";

jest.mock("@/components/app-menu-item/AppMenuItem", () => {
  const MockAppMenuItem = (props: AppMenuItemProps) => (
    <li onClick={props.onClick}>{props.children}</li>
  );
  MockAppMenuItem.displaName = "MockAppMenuItem";
  return MockAppMenuItem;
});

const mockedOnClick = jest.fn();
const mockedOnClose = jest.fn();
const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "myProfile",
    icon: AccountCircleRoundedIcon,
    onClick: mockedOnClick
  }
];

describe("AppMenu", () => {
  beforeEach(() => {
    render(
      <AppMenu
        anchorEl={document.createElement("div")}
        open={true}
        onClose={mockedOnClose}
        items={mockMenuItems}
      />
    );
  });

  it("should render without crashing", () => {
    const menu = screen.getByText("myProfile");
    expect(menu).toBeInTheDocument();
  });

  it("should call onClick and onClose handlers", async () => {
    const menu = screen.getByText("myProfile");

    await userEvent.click(menu);
    expect(mockedOnClick).toHaveBeenCalled();
    expect(mockedOnClose).toHaveBeenCalled();
  });
});
