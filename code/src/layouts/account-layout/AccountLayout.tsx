import { Outlet } from "react-router-dom";

import AccountTitle from "@/components/account-page/AccountTitle";
import AppBox from "@/components/app-box/AppBox";
import Sidebar from "@/components/sidebar/Sidebar";

import * as styles from "./AccountLayout.module.scss";

const AccountLayout = () => {
  return (
    <AppBox className={styles.accountLayoutWrapper}>
      <AppBox className={styles.header}>
        <AccountTitle />
        <AppBox className={styles.divider} />
      </AppBox>

      <AppBox className={styles.accountLayout}>
        <AppBox className={styles.sidebarSection}>
          <Sidebar />
        </AppBox>

        <AppBox className={styles.contentSection}>
          <Outlet />
        </AppBox>
      </AppBox>
    </AppBox>
  );
};

export default AccountLayout;
