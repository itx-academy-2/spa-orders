import { PropsWithChildren, createContext, useContext, useState } from "react";

import ConfirmDialog from "@/containers/confirm-dialog/ConfirmDialog";

import {
  ConfirmButtonsText,
  ConfirmButtonsVariant,
  ConfirmCallbacks,
  ConfirmConfig,
  ConfirmContextType,
  ConfirmLabels
} from "@/context/confirm/ConfirmContext.types";

const ConfirmContext = createContext<ConfirmContextType>(
  null as unknown as ConfirmContextType
);

export const ConfirmProvider = ({ children }: Required<PropsWithChildren>) => {
  const [confirmLabels, setConfirmLabels] = useState<ConfirmLabels>({});
  const [confirmCallbacks, setConfirmCallbacks] = useState<ConfirmCallbacks>(
    {}
  );

  const [confirmButtonVariant, setConfirmButtonsVariant] =
    useState<ConfirmButtonsVariant>({});

  const [confirmButtonsText, setConfirmButtonsText] =
    useState<ConfirmButtonsText>({});

  const [isOpen, setIsOpen] = useState(false);

  const handleCloseConfirm = () => {
    setIsOpen(false);
    setConfirmCallbacks({});
    setConfirmLabels({});
    setConfirmButtonsVariant({});
    setConfirmButtonsText({});
  };

  const handleOpenConfirm = (config: ConfirmConfig) => {
    setIsOpen(true);
    setConfirmCallbacks({
      onConfirm: config.onConfirm,
      onCancel: config.onCancel
    });
    setConfirmLabels({
      mainText: config.mainText,
      secondaryText: config.secondaryText
    });
    setConfirmButtonsVariant({
      cancelButton: config.cancelButtonVariant,
      confirmButton: config.confirmButtonVariant
    });
    setConfirmButtonsText({
      cancelButton: config.cancelButtonText,
      confirmButton: config.confirmButtonText
    });
  };

  const handleCancel = () => {
    if (confirmCallbacks.onCancel) confirmCallbacks.onCancel();
    handleCloseConfirm();
  };

  const handleConfirm = () => {
    if (confirmCallbacks.onConfirm) confirmCallbacks.onConfirm();
    handleCloseConfirm();
  };

  const value = {
    closeConfirm: handleCloseConfirm,
    openConfirm: handleOpenConfirm,
    isOpen
  };

  const confirm = isOpen && (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleCloseConfirm}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      title={confirmLabels.mainText}
      subtitle={confirmLabels.secondaryText}
      cancelButtonText={confirmButtonsText.cancelButton}
      confirmButtonText={confirmButtonsText.confirmButton}
      confirmButtonVariant={confirmButtonVariant.confirmButton}
      cancelButtonVariant={confirmButtonVariant.cancelButton}
    />
  );

  return (
    <ConfirmContext.Provider value={value}>
      {confirm}
      {children}
    </ConfirmContext.Provider>
  );
};

export const useConfirmContext = () => {
  const context = useContext(ConfirmContext);

  if (context === null) {
    throw new Error("useConfirmContext must be used within a ConfirmProvider");
  }

  return context;
};
