import React from "react";
import { Outlet } from "react-router-dom";

import { Box } from "@mui/material";

import AccountTitle from "@/components/account-page/AccountTitle";
import Sidebar from "@/components/sidebar/Sidebar";

import * as styles from "./AccountLayout.module.scss";

const AccountLayout = () => {
  return (
    <Box className={styles.accountLayoutWrapper}>
      <Box className={styles.header}>
        <AccountTitle />
        <Box className={styles.divider} />
      </Box>

      <Box className={styles.accountLayout}>
        <Box className={styles.sidebarSection}>
          <Sidebar />
        </Box>

        <Box className={styles.contentSection}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AccountLayout;
