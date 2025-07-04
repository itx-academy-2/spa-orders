import type { SvgIconComponent } from "@mui/icons-material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";

import routes from "@/constants/routes";

type MenuAction = { type: "navigate"; path: string } | { type: "logout" };

export interface RawMenuItem {
  id: number;
  name: string;
  icon: SvgIconComponent;
  action: MenuAction;
}

export const rawMenuItems: RawMenuItem[] = [
  {
    id: 1,
    name: "header.myProfile",
    icon: AccountCircleRoundedIcon,
    action: { type: "navigate", path: routes.userCabinet.path }
  },
  {
    id: 2,
    name: "header.orders",
    icon: ListAltIcon,
    action: { type: "navigate", path: routes.orders.path }
  },
  {
    id: 3,
    name: "header.logout",
    icon: LogoutIcon,
    action: { type: "logout" }
  }
];
