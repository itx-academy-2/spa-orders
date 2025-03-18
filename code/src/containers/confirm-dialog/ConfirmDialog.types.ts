import { ReactNode } from "react";

import { AppButtonProps } from "@/components/app-button/AppButton.types";

export type ConfirmDialogProps = {
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelButtonText?: ReactNode;
  confirmButtonText?: ReactNode;
  cancelButtonVariant?: AppButtonProps["variant"];
  confirmButtonVariant?: AppButtonProps["variant"];
  title: ReactNode;
  subtitle?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};
