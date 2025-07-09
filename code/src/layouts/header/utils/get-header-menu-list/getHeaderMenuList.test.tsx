import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";

import { RawMenuItem } from "@/layouts/header/components/header-buttons/header-account-button/HeaderAccountButton.constants";

import { getHeaderMenuList } from "./getHeaderMenuList";

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

const logoutItem: RawMenuItem = {
  id: 1,
  name: "Logout",
  icon: LogoutIcon,
  action: { type: "logout" }
};

const ordersItem: RawMenuItem = {
  id: 2,
  name: "Orders",
  icon: ListAltIcon,
  action: { type: "navigate", path: "/orders" }
};

describe("getHeaderMenuList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should map logout action to handleLogout", () => {
    const menu = getHeaderMenuList([logoutItem], mockNavigate, mockLogout);

    expect(menu).toHaveLength(1);
    expect(menu[0].id).toBe(logoutItem.id);
    expect(menu[0].name).toBe(logoutItem.name);
    expect(menu[0].icon).toBe(logoutItem.icon);
    expect(typeof menu[0].onClick).toBe("function");

    menu[0].onClick();

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should map navigate action to navigate function", () => {
    const menu = getHeaderMenuList([ordersItem], mockNavigate, mockLogout);

    expect(menu).toHaveLength(1);
    expect(menu[0].id).toBe(ordersItem.id);
    expect(menu[0].name).toBe(ordersItem.name);
    expect(menu[0].icon).toBe(ordersItem.icon);
    expect(typeof menu[0].onClick).toBe("function");

    menu[0].onClick();

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/orders");
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("should map multiple items correctly", () => {
    const menu = getHeaderMenuList(
      [logoutItem, ordersItem],
      mockNavigate,
      mockLogout
    );

    expect(menu).toHaveLength(2);

    menu[0].onClick();
    expect(mockLogout).toHaveBeenCalledTimes(1);

    menu[1].onClick();
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/orders");
  });
});
