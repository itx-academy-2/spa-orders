import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";
import cn from "clsx";

import * as styles from "./SidebarMenu.module.scss";

export type MenuItem = {
  id: string;
  label: string;
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
                  <Typography className={styles.menuText}>
                    {item.label}
                  </Typography>
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
