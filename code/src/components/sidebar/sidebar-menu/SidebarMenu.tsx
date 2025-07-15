import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import cn from "clsx";

import AppTypography from "@/components/app-typography/AppTypography";

import * as styles from "./SidebarMenu.module.scss";

export type MenuItem = {
  id: string;
  translationKey: string;
  path: string;
};

type SidebarMenuProps = {
  items: MenuItem[];
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <List className={styles.menuList}>
      {items.map((item) => {
        const isActive = location.pathname.includes(item.path);

        return (
          <ListItem key={item.id} className={styles.menuItem}>
            <ListItemButton
              className={cn(styles.menuButton, {
                [styles.active]: isActive
              })}
              onClick={() => navigate(item.path)}
            >
              <ListItemText
                primary={
                  <AppTypography
                    className={styles.menuText}
                    translationKey={item.translationKey}
                  />
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SidebarMenu;
