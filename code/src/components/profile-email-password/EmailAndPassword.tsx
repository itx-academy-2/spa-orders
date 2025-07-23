import * as styles from "@/components/profile-email-password/EmailAndPassword.module.scss";

import AppButton from "../app-button/AppButton";
import AppContainer from "../app-container/AppContainer";
import AppInput from "../app-input/AppInput";
import AppTypography from "../app-typography/AppTypography";

interface EmailAndPasswordProps {
  email: string;
}

const EmailAndPassword = ({ email }: EmailAndPasswordProps) => {
  return (
    <AppContainer className={styles.emailAndPassword}>
      <AppTypography
        translationKey="emailAndPassword.title"
        variant="subtitle1"
        fontWeight="semi-bold"
      />
      <AppInput
        value={email}
        labelTranslationKey="emailAndPassword.inputLabel"
        className={styles.emailAndPassword_inputField}
        disabled
        data-cy="profile-email"
      />
      <AppButton
        className={styles.emailAndPassword_changeButton}
        type="button"
        size="small"
        data-cy="profile-change-password"
        data-testid="profile-change-password"
      >
        <AppTypography
          variant="caption"
          component="span"
          translationKey="emailAndPassword.buttonLabel"
        />
      </AppButton>
    </AppContainer>
  );
};

export default EmailAndPassword;
