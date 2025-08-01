import { useEffect, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";

import { DeliveryFormData } from "@/containers/forms/delivery-form/DeliveryForm.types";

import { addressSyncFields } from "@/hooks/use-address-sync/useAddressSync.consts";
import { PostAddressExtended } from "@/types/delivery.types";

const useAddressSync = ({
  addresses,
  selectedDropdown,
  watchedFields,
  setValue
}: {
  addresses: PostAddressExtended[];
  selectedDropdown: string;
  watchedFields: Record<string, string>;
  setValue: UseFormSetValue<DeliveryFormData>;
}) => {
  const prevSelectedTitle = useRef<string | undefined>();
  const clearedTitleRef = useRef(false);

  useEffect(() => {
    if (!selectedDropdown) return;
    const selected = addresses.find((addr) => addr.title === selectedDropdown);
    if (!selected) return;

    const fieldNames = addressSyncFields;

    // Check if any form fields differ from the selected address
    const changed = fieldNames.some((field) => {
      const selectedValue = selected[field as keyof PostAddressExtended];
      return (
        selectedValue !== undefined && watchedFields[field] !== selectedValue
      );
    });

    // Clear title once when user modifies fields but title still matches selected address
    // This prevents conflicts when user wants to save as a new address
    if (
      changed &&
      watchedFields.title === selected.title &&
      !clearedTitleRef.current
    ) {
      setValue("title", "");
      clearedTitleRef.current = true;
    }

    // Reset the cleared flag when fields match the selected address again
    if (!changed) {
      clearedTitleRef.current = false;
    }
  }, [watchedFields, selectedDropdown, addresses, setValue]);

  useEffect(() => {
    if (selectedDropdown && prevSelectedTitle.current !== selectedDropdown) {
      const selected = addresses.find(
        (addr) => addr.title === selectedDropdown
      );
      if (selected) {
        setValue("firstName", selected.firstName);
        setValue("lastName", selected.lastName);
        setValue("phone", selected.phone);
        setValue("city", selected.city);
        setValue("department", selected.department);
        setValue("deliveryMethod", selected.deliveryMethod);
        setValue("title", selected.title);
      }
      prevSelectedTitle.current = selectedDropdown;
    }
  }, [selectedDropdown, addresses, setValue]);
};

export default useAddressSync;
