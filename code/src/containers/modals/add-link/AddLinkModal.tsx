import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";

import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppInput from "@/components/app-input/AppInput";
import AppTypography from "@/components/app-typography/AppTypography";

import { useModalContext } from "@/context/modal/ModalContext";
import { useUpdateUserPhotoMutation } from "@/store/api/userProfileApi";
import {
  AddLinkValidationSchema,
  AddLinkValidatorType
} from "@/utils/validators/photoScheme";

import * as styles from "@/containers/modals/add-link/AddLinkModal.module.scss";

const AddLinkModal = () => {
  const { closeModal } = useModalContext();
  const { formatMessage } = useIntl();
  const [updateUserPhotoURL, { isLoading, isSuccess }] =
    useUpdateUserPhotoMutation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AddLinkValidatorType>({
    resolver: zodResolver(AddLinkValidationSchema),
    defaultValues: {
      photoURL: ""
    }
  });

  useEffect(() => {
    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess, closeModal]);

  const onSubmit = (data: AddLinkValidatorType) => {
    updateUserPhotoURL({ photo: data.photoURL });
  };

  return (
    <AppBox
      className={styles.addLinkModal}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      data-cy="add-link-modal"
    >
      <AppIconButton
        onClick={closeModal}
        className={styles.addLinkModal_closeIcon}
        type="button"
        aria-label={formatMessage({ id: "addLink.closeButton" })}
      >
        <CloseIcon />
      </AppIconButton>
      <AppTypography variant="h3" translationKey="addLink.title" />
      <AppTypography translationKey="addLink.description" />
      <AppInput
        {...register("photoURL")}
        error={Boolean(errors.photoURL)}
        helperText={
          errors.photoURL
            ? formatMessage({ id: errors.photoURL.message })
            : undefined
        }
        labelTranslationKey="addLink.inputLabel"
        data-cy="URL-input"
        type="url"
        autoFocus
      />
      <AppBox className={styles.addLinkModal_buttonsContainer}>
        <AppButton type="button" onClick={closeModal} variant="danger">
          <AppTypography translationKey="addLink.closeButton" />
        </AppButton>
        <AppButton type="submit" isLoading={isLoading} disabled={isLoading}>
          <AppTypography translationKey="addLink.saveButton" />
        </AppButton>
      </AppBox>
    </AppBox>
  );
};

export default AddLinkModal;
