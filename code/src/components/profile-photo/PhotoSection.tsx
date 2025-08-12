import { useEffect, useState } from "react";

import AddLinkModal from "@/containers/modals/add-link/AddLinkModal";
import ConfirmModal from "@/containers/modals/confirm-modal/ConfirmModal";

import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppTypography from "@/components/app-typography/AppTypography";

import defaultImage from "@/assets/images/profile/profile-img.svg";
import { useModalContext } from "@/context/modal/ModalContext";
import { useDeleteUserPhotoMutation } from "@/store/api/userProfileApi";

import * as styles from "@/components/profile-photo/PhotoSection.module.scss";

type PhotoSectionProps = {
  photo: string | null;
};

const PhotoSection = ({ photo }: PhotoSectionProps) => {
  const [imgSrc, setImgSrc] = useState<string>(() => photo || defaultImage);
  const { openModal, closeModal } = useModalContext();
  const [deleteUserPhoto] = useDeleteUserPhotoMutation();

  useEffect(() => {
    setImgSrc(photo || defaultImage);
  }, [photo]);

  const handleUpdaloadPhoto = () => {
    openModal(<AddLinkModal />);
  };

  const handleRemovePhoto = () => {
    openModal(
      <ConfirmModal
        title="photoSection.confirmDeleteModal.title"
        description="photoSection.confirmDeleteModal.description"
        onCancel={closeModal}
        onSave={deleteUserPhoto}
        textSave="photoSection.confirmDeleteModal.clearButton"
      />
    );
  };

  return (
    <AppBox className={styles.photoSection}>
      <AppBox
        alt="Profile photo"
        className={styles.photoSection__image}
        data-cy="profile-img"
        component="img"
        src={imgSrc}
      />
      <AppBox className={styles.photoSection__actions}>
        <AppTypography
          translationKey="photoSection.title"
          variant="subtitle1"
          fontWeight="semi-bold"
        />
        <AppBox className={styles.photoSection__actions_buttons}>
          <AppButton
            type="button"
            size="small"
            onClick={handleUpdaloadPhoto}
            data-cy="upload-photo-button"
            data-testid="upload-photo-button"
          >
            <AppTypography
              variant="caption"
              component="span"
              translationKey="photoSection.uploadButton"
            />
          </AppButton>
          <AppButton
            type="button"
            size="small"
            variant="danger"
            onClick={handleRemovePhoto}
            data-cy="remove-photo-button"
            data-testid="remove-photo-button"
          >
            <AppTypography
              variant="caption"
              component="span"
              translationKey="photoSection.deleteButton"
            />
          </AppButton>
        </AppBox>
      </AppBox>
    </AppBox>
  );
};

export default PhotoSection;
