import { forwardRef } from "react";

import AppBox from "@/components/app-box/AppBox";
import AppMenuItem from "@/components/app-menu-item/AppMenuItem";
import AppTypography from "@/components/app-typography/AppTypography";

import * as styles from "./AddressMenuItem.module.scss";

type Address = {
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  deliveryMethod: string;
  department: string;
};

type AddressMenuItemProps = {
  address: Address;
} & React.ComponentProps<typeof AppMenuItem>;

const AddressMenuItem = forwardRef<HTMLLIElement, AddressMenuItemProps>(
  ({ address, ...props }, ref) => (
    <AppMenuItem
      ref={ref}
      value={address.title}
      data-testid={`address-${address.title}`}
      className={styles.addressContainer}
      {...props}
    >
      <AppTypography fontWeight="extra-bold" translate="no">
        {address.title}
      </AppTypography>
      <AppBox className={styles.addressContainer_addressRow}>
        <AppTypography variant="caption-small" translate="no">
          {address.firstName}&nbsp;
        </AppTypography>
        <AppTypography variant="caption-small" translate="no">
          {address.lastName}&nbsp;
        </AppTypography>
        <AppTypography variant="caption-small" translate="no">
          {address.phone}
        </AppTypography>
      </AppBox>
      <AppBox className={styles.addressContainer_addressRow}>
        <AppTypography variant="caption-small" translate="no">
          {address.city}&nbsp;
        </AppTypography>
        <AppTypography variant="caption-small" translate="no">
          {address.deliveryMethod}&nbsp;
        </AppTypography>
        <AppTypography variant="caption-small" translate="no">
          {address.department}
        </AppTypography>
      </AppBox>
    </AppMenuItem>
  )
);

AddressMenuItem.displayName = "AddressMenuItem";

export default AddressMenuItem;
