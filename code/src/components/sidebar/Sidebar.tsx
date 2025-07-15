import React from "react";

import cn from "clsx";

import AppBox from "@/components/app-box/AppBox";

import routes from "@/constants/routes";

import * as styles from "./Sidebar.module.scss";

import SidebarMenu from "./sidebar-menu/SidebarMenu";
import { MenuItem } from "./sidebar-menu/types";

const menuItems: MenuItem[] = [
  {
    id: "profile",
    translationKey: "label.profile",
    path: routes.userCabinet.profile.path
  },
  {
    id: "view-history",
    translationKey: "label.history",
    path: routes.userCabinet.viewHistory.path
  },
  {
    id: "wishlist",
    translationKey: "label.wishlist",
    path: routes.userCabinet.wishlist.path
  },
  {
    id: "addresses",
    translationKey: "label.addresses",
    path: routes.userCabinet.addresses.path
  }
];

type SidebarProps = {
  className?: string;
};

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <AppBox className={cn(styles.sidebar, className)}>
      <SidebarMenu items={menuItems} />
    </AppBox>
  );
};

export default Sidebar;
