import React from "react";

import * as styles from "./AccountTitle.module.scss";

import AppBox from "../app-box/AppBox";
import AppTypography from "../app-typography/AppTypography";

const AccountTitle: React.FC = () => {
  return (
    <AppBox className={styles.accountTitle}>
      <AppTypography
        variant="h1"
        className={styles.accountTitle__title}
        translationKey="userCabinet.title"
      />

      <AppTypography
        variant="body"
        className={styles.accountTitle__description}
        translationKey="userCabinet.description"
      />
    </AppBox>
  );
};

export default AccountTitle;
