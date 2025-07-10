import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";

import routes from "@/constants/routes";

import * as styles from "./Sidebar.module.scss";

type MenuItem = {
  id: string;
  label: string;
  path: string;
};

const menuItems: MenuItem[] = [
  { id: "profile", label: "Profile", path: routes.userCabinet.profile.path },
  {
    id: "view-history",
    label: "View History",
    path: routes.userCabinet.viewHistory.path
  },
  {
    id: "wishlist",
    label: "My Wishlist",
    path: routes.userCabinet.wishlist.path
  },
  {
    id: "addresses",
    label: "My Addresses",
    path: routes.userCabinet.addresses.path
  }
];

type SidebarProps = {
  className?: string;
};

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box className={`${styles.sidebar} ${className || ""}`}>
      <List className={styles.menuList}>
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.path);

          return (
            <ListItem key={item.id} className={styles.menuItem}>
              <ListItemButton
                className={`${styles.menuButton} ${isActive ? styles.active : ""}`}
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
    </Box>
  );
};

export default Sidebar;
