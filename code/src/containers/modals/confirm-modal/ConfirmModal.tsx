import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogActions } from "@mui/material";

import AppButton from "@/components/app-button/AppButton";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppTypography from "@/components/app-typography/AppTypography";

import * as styles from "@/containers/modals/confirm-modal/ConfirmModal.module.scss";

interface ConfirmModalProps {
  title: string;
  description?: string;
  onCancel: () => void;
  onSave: () => void;
  textSave?: string;
  textCancel?: string;
}

const ConfirmModal = ({
  onCancel,
  title,
  description,
  onSave,
  textSave = "confirmModal.saveButton",
  textCancel = "confirmModal.closeButton"
}: ConfirmModalProps) => {
  const handleClose = () => {
    onCancel();
  };

  const handleSave = () => {
    onSave();
    onCancel();
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      PaperProps={{
        className: styles.confirmModal,
        "data-testid": "confirm-modal-paper",
        "data-cy": "confirm-modal"
      }}
    >
      <AppTypography variant="h3" translationKey={title} />
      <AppIconButton
        className={styles.confirmModal_closeIcon}
        data-testid="close-modal"
        onClick={handleClose}
      >
        <CloseIcon />
      </AppIconButton>
      {description && <AppTypography translationKey={description} />}
      <DialogActions>
        <AppButton onClick={handleClose} variant="danger" data-cy="close-button">
          <AppTypography translationKey={textCancel} />
        </AppButton>
        <AppButton onClick={handleSave} data-cy="save-button">
          <AppTypography translationKey={textSave} />
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
