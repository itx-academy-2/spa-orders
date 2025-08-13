import CloseIcon from "@mui/icons-material/Close";

import { AddressCardProps } from "@/components/address-card/AddressCard.types";
import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";
import ConfirmModal from "@/containers/modals/confirm-modal/ConfirmModal";
import AppIconButton from "../app-icon-button/AppIconButton";

import { useRemoveUserPermanentAddressMutation } from "@/store/api/addressApi";
import { useUserDetailsSelector } from "@/store/slices/userSlice";
import { useModalContext } from "@/context/modal/ModalContext";

import * as styles from "@/components/address-card/AddressCard.module.scss";

const AddressCard = ({ address }: AddressCardProps) => {
  const { id, title, firstName, lastName, phone, city, postMethod, department } = address;

  const user = useUserDetailsSelector();
  const userId = user?.id;

  const [removeAddress, { isLoading }] = useRemoveUserPermanentAddressMutation();
  const { openModal, closeModal } = useModalContext();

  if (typeof userId !== "number") {
    throw new Error("UserId is required and must be a number");
  }

  const handleRemove = () => {
    openModal(
      <ConfirmModal
        title="addressCard.confirmModal.title"
        description="addressCard.confirmModal.description"
        onCancel={closeModal}
        onSave={async () => {
            await removeAddress({ userId, addressId: id }).unwrap();
        }}
        textCancel="addressCard.confirmModal.closeButton"
        textSave="addressCard.confirmModal.saveButton"
      />
    );
  };

  return (
    <AppBox className={styles.addressCard} data-testid="address-card" data-cy="address-card">
      <AppBox className={styles.addressCard_header}>
        <AppTypography variant="subtitle2">{title}</AppTypography>
        <AppIconButton
          className={styles.addressCard_header__closeIcon}
          data-testid="remove-address"
          disabled={isLoading}
          onClick={handleRemove}
        >
          <CloseIcon />
        </AppIconButton>
      </AppBox>
      <AppBox className={styles.addressCard_container}>
        <AppTypography>
          {firstName} {lastName}
        </AppTypography>
        <AppTypography>{phone}</AppTypography>
        <AppTypography className={styles.addressCard_container__location}>
          {city}, {postMethod}, {department}
        </AppTypography>
      </AppBox>
    </AppBox>
  );
};

export default AddressCard;
