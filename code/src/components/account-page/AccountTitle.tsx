import React from "react";

import * as styles from "./AccountTitle.module.scss";

interface AccountTitleProps {
  title: string;
  description?: string;
}

const AccountTitle: React.FC<AccountTitleProps> = ({ title, description }) => {
  return (
    <div className={styles.accountTitle}>
      <h1 className={styles.accountTitle__title}>{title}</h1>
      {description && (
        <p className={styles.accountTitle__description}>{description}</p>
      )}
    </div>
  );
};

export default AccountTitle;
