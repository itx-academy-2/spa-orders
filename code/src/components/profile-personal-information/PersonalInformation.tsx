import EditPersonalInfoModal from "@/containers/modals/user-account/EditPersonalInfoModal";

import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppContainer from "@/components/app-container/AppContainer";
import AppInput from "@/components/app-input/AppInput";
import AppTypography from "@/components/app-typography/AppTypography";

import { useModalContext } from "@/context/modal/ModalContext";

import * as styles from "@/components/profile-personal-information/PersonalInformation.module.scss";

import { PersonalInformationProps } from "./PersonalInformation.types";

const PersonalInformation = ({
  firstName,
  lastName,
  phone
}: PersonalInformationProps) => {
  const { openModal } = useModalContext();

  const handleChangePersonalInformation = () => {
    openModal(
      <EditPersonalInfoModal
        firstName={firstName}
        lastName={lastName}
        phone={phone}
      />
    );
  };

  return (
    <AppContainer className={styles.PersonalInformation}>
      <AppTypography
        className={styles.PersonalInformation_title}
        translationKey="personalInformation.title"
        variant="subtitle1"
        fontWeight="semi-bold"
      />
      <AppBox className={styles.PersonalInformation_firstLastNames}>
        <AppInput
          value={firstName}
          labelTranslationKey="personalInformation.firstName.field"
          className={styles.PersonalInformation_firstLastNames__firstName}
          disabled
          data-cy="personal-information-first-name"
        />
        <AppInput
          value={lastName}
          labelTranslationKey="personalInformation.lastName.field"
          className={styles.PersonalInformation_firstLastNames__lastName}
          disabled
          data-cy="personal-information-last-name"
        />
      </AppBox>
      <AppBox className={styles.PersonalInformation_phone}>
        <AppInput
          value={phone}
          labelTranslationKey="personalInformation.phone.field"
          className={styles.PersonalInformation_phone__field}
          disabled
          data-cy="personal-information-phone"
        />
      </AppBox>
      <AppButton
        className={styles.PersonalInformation_changeButton}
        type="button"
        size="small"
        onClick={handleChangePersonalInformation}
        data-cy="personal-information-change-button"
        data-testid="personal-information-change-button"
      >
        <AppTypography
          variant="caption"
          component="span"
          translationKey="personalInformation.changeButton"
        />
      </AppButton>
    </AppContainer>
  );
};

export default PersonalInformation;
