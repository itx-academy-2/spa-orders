import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";

import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppContainer from "@/components/app-container/AppContainer";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppInput from "@/components/app-input/AppInput";
import AppTypography from "@/components/app-typography/AppTypography";

import { useModalContext } from "@/context/modal/ModalContext";
import {
  PersonalInfoValidationScheme,
  PersonalInfoValidatorType
} from "@/utils/validators/personalInfoScheme";

import * as styles from "@/containers/modals/user-account/EditPersonalInfoModal.module.scss";

interface EditPersonalInfoModalProps {
  firstName: string;
  lastName: string;
  phone: string | null;
}
const EditPersonalInfoModal = ({
  firstName,
  lastName,
  phone
}: EditPersonalInfoModalProps) => {
  const { closeModal } = useModalContext();
  const { formatMessage } = useIntl();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PersonalInfoValidatorType>({
    resolver: zodResolver(PersonalInfoValidationScheme),
    defaultValues: {
      firstName,
      lastName,
      phone: phone || ""
    }
  });
  const onSubmit = async (data: PersonalInfoValidatorType) => {};

  return (
    <AppContainer
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className={styles.personalInfoModal}
      data-cy="edit-personal-info-modal"
    >
      <AppIconButton
        className={styles.personalInfoModal_closeIcon}
        onClick={closeModal}
      >
        <CloseIcon />
      </AppIconButton>
      <AppTypography variant="h3" translationKey="personalInfo.title" />
      <AppBox className={styles.personalInfoModal_inputWrapper}>
        <AppInput
          {...register("firstName")}
          error={Boolean(errors.firstName)}
          helperText={
            errors.firstName
              ? formatMessage({ id: errors.firstName.message })
              : undefined
          }
          labelTranslationKey="personalInfo.firstname"
          autoComplete="given-name"
          data-cy="firstname"
        />
        <AppInput
          {...register("lastName")}
          error={Boolean(errors.lastName)}
          helperText={
            errors.lastName
              ? formatMessage({ id: errors.lastName.message })
              : undefined
          }
          labelTranslationKey="personalInfo.lastname"
          autoComplete="family-name"
          data-cy="lastname"
        />
        <AppInput
          {...register("phone")}
          error={Boolean(errors.phone)}
          helperText={
            errors.phone
              ? formatMessage({ id: errors.phone.message })
              : undefined
          }
          labelTranslationKey="personalInfo.phone"
          autoComplete="tel"
          data-cy="phone-number"
          type="tel"
        />
      </AppBox>
      <AppButton size="large" type="submit" data-cy="save-personal-info-button">
        <AppTypography
          variant="subtitle2"
          component="span"
          translationKey="personalInfo.button"
          fontWeight="extra-bold"
        />
      </AppButton>
    </AppContainer>
  );
};

export default EditPersonalInfoModal;
