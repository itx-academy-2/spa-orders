import React from "react";

import * as styles from "./AccountTitle.module.scss";

import AppBox from "../app-box/AppBox";
import AppTypography from "../app-typography/AppTypography";

type AccountTitleProps = {
  title: string;
  description?: string;
};

const AccountTitle: React.FC<AccountTitleProps> = ({ title, description }) => {
  return (
    <AppBox className={styles.accountTitle}>
      <AppTypography variant="h1" className={styles.accountTitle__title}>
        {title}
      </AppTypography>

      {description && (
        <AppTypography
          variant="body"
          className={styles.accountTitle__description}
        >
          {description}
        </AppTypography>
      )}
    </AppBox>
  );
};

export default AccountTitle;
