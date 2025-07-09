import React, { useState } from "react";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";

import * as styles from "./Sidebar.module.scss";

type MenuItem = {
  id: string;
  label: string;
};

type SidebarProps = {
  className?: string;
  onItemClick?: (item: MenuItem) => void;
};

const menuItems: MenuItem[] = [
  { id: "profile", label: "Profile" },
  { id: "view-history", label: "View History" },
  { id: "wishlist", label: "My Wishlist" },
  { id: "addresses", label: "My Addresses" }
];

const Sidebar: React.FC<SidebarProps> = ({ className, onItemClick }) => {
  const [activeItem, setActiveItem] = useState<string>("View History");

  const handleItemClick = (item: MenuItem): void => {
    setActiveItem(item.label);
    onItemClick?.(item);
  };

  return (
    <Box className={`${styles.sidebar} ${className || ""}`}>
      <List className={styles.menuList}>
        {menuItems.map((item: MenuItem) => (
          <ListItem key={item.id} className={styles.menuItem}>
            <ListItemButton
              className={`${styles.menuButton} ${
                activeItem === item.label ? styles.active : ""
              }`}
              onClick={() => handleItemClick(item)}
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
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
