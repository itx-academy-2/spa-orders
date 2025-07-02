import { useNavigate } from "react-router-dom";

import type { SvgIconComponent } from "@mui/icons-material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";

import type { MenuItem } from "@/components/app-menu/AppMenu.types";

import routes from "@/constants/routes";

type IconName = "AccountCircleRounded" | "ListAlt" | "Logout";

export const menuIcons: Record<IconName, SvgIconComponent> = {
  AccountCircleRounded: AccountCircleRoundedIcon,
  ListAlt: ListAltIcon,
  Logout: LogoutIcon
};

export const getHeaderMenuList = (
  navigate: ReturnType<typeof useNavigate>,
  handleLogout: () => void
): MenuItem[] => [
  {
    id: 1,
    name: "header.myProfile",
    icon: menuIcons.AccountCircleRounded,
    onClick: () => navigate(routes.userCabinet.path)
  },
  {
    id: 2,
    name: "header.orders",
    icon: menuIcons.ListAlt,
    onClick: () => navigate(routes.orders.path)
  },
  {
    id: 3,
    name: "header.logout",
    icon: menuIcons.Logout,
    onClick: () => handleLogout()
  }
];
