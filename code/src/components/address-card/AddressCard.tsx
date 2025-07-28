import CloseIcon from "@mui/icons-material/Close";

import { AddressCardProps } from "@/components/address-card/AddressCard.types";
import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

import * as styles from "@/components/address-card/AddressCard.module.scss";

const AddressCard = ({ address }: AddressCardProps) => {
  const { title, firstName, lastName, phone, city, postMethod, department } =
    address;

  return (
    <AppBox className={styles.addressCard}>
      <AppBox className={styles.addressCard_header}>
        <AppTypography variant="subtitle2">{title}</AppTypography>
        <CloseIcon />
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
