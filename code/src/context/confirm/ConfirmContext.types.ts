import { ReactNode } from "react";

import { AppButtonProps } from "@/components/app-button/AppButton.types";

export type ConfirmConfig = {
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelButtonText?: ReactNode;
  confirmButtonText?: ReactNode;
  cancelButtonVariant?: AppButtonProps["variant"];
  confirmButtonVariant?: AppButtonProps["variant"];
  mainText: ReactNode;
  secondaryText?: ReactNode;
};

export type ConfirmContextType = {
  openConfirm: (config: ConfirmConfig) => void;
  closeConfirm: () => void;
  isOpen: boolean;
};

export type ConfirmLabels = {
  mainText?: ReactNode;
  secondaryText?: ReactNode;
};

export type ConfirmCallbacks = {
  onCancel?: () => void;
  onConfirm?: () => void;
};

export type ConfirmButtonsText = {
  cancelButton?: ReactNode;
  confirmButton?: ReactNode;
};

export type ConfirmButtonsVariant = {
  cancelButton?: AppButtonProps["variant"];
  confirmButton?: AppButtonProps["variant"];
};
