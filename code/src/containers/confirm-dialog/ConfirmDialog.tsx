import { useIntl } from "react-intl";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";

import { ConfirmDialogProps } from "@/containers/confirm-dialog/ConfirmDialog.types";

import AppButton from "@/components/app-button/AppButton";

import "@/containers/confirm-dialog/ConfirmDialog.styles.scss";

const ConfirmDialog = ({
  isOpen,
  onCancel,
  onConfirm,
  onClose,
  title,
  subtitle,
  cancelButtonText = "confirmDialog.cancel",
  confirmButtonText = "confirmDialog.confirm",
  cancelButtonVariant = "outlined",
  confirmButtonVariant = "contained"
}: ConfirmDialogProps) => {
  const { formatMessage } = useIntl();

  const cancelButtonLabel =
    typeof cancelButtonText === "string"
      ? formatMessage({ id: cancelButtonText })
      : cancelButtonText;

  const confirmButtonLabel =
    typeof confirmButtonText === "string"
      ? formatMessage({ id: confirmButtonText })
      : confirmButtonText;

  const titleLabel =
    typeof title === "string" ? formatMessage({ id: title }) : title;

  const subtitleLabel =
    typeof subtitle === "string" ? formatMessage({ id: subtitle }) : subtitle;

  return (
    <Dialog
      data-testid="confirm-dialog"
      PaperProps={{ className: "confirm-dialog" }}
      open={isOpen}
      onClose={onClose}
      slotProps={{
        backdrop: { "data-testid": "confirm-dialog-backdrope" } as object
      }}
    >
      <DialogTitle className="confirm-dialog__title">{titleLabel}</DialogTitle>
      {subtitle && (
        <DialogContent>
          <DialogContentText>{subtitleLabel}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <AppButton autoFocus variant={cancelButtonVariant} onClick={onCancel}>
          {cancelButtonLabel}
        </AppButton>
        <AppButton variant={confirmButtonVariant} onClick={onConfirm}>
          {confirmButtonLabel}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
