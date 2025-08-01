import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  DeliveryFormData,
  DeliveryFormProps
} from "@/containers/forms/delivery-form/DeliveryForm.types";
import AddressMenuItem from "@/containers/forms/delivery-form/components/address-menu-item/AddressMenuItem";
import DeliveryFormFields from "@/containers/forms/delivery-form/components/delivery-from-fields/DeliveryFormFields";
import OrderSummary from "@/containers/order-summary/OrderSummary";

import AppBox from "@/components/app-box/AppBox";
import AppCheckbox from "@/components/app-checkbox/AppCheckbox";
import AppSelect from "@/components/app-select/AppSelect";
import AppTypography from "@/components/app-typography/AppTypography";

import { deliveryMethods } from "@/constants/deliveryMethods";
import useAddressSync from "@/hooks/use-address-sync/useAddressSync";
import useGetUserDetails from "@/hooks/use-get-user-details/useGetUserDetails";
import useSnackbar from "@/hooks/use-snackbar/useSnackbar";
import { useCreateOrderV2Mutation } from "@/store/api/ordersApi";
import { PostAddressExtended } from "@/types/delivery.types";
import isErrorWithStatus from "@/utils/is-error-with-status/isErrorWithStatus";
import { PostAddressValidationScheme } from "@/utils/validators/deliveryScheme";

import "@/containers/forms/delivery-form/DeliveryForm.scss";

const DeliveryForm = ({
  totalPrice,
  totalDiscountedPrice
}: DeliveryFormProps) => {
  const [checked, setChecked] = useState(false);
  const { id } = useGetUserDetails();

  const { openSnackbarWithTimeout } = useSnackbar();

  // Temporary addresses
  // TODO: fetch saved addresses via API
  const addresses: PostAddressExtended[] = [
    {
      id: "1",
      deliveryMethod: "UKRPOSHTA",
      city: "Lviv",
      department: "52",
      title: "Home",
      firstName: "John",
      lastName: "Doe",
      phone: "+380960775434"
    },
    {
      id: "2",
      deliveryMethod: "UKRPOSHTA",
      city: "Kyiv",
      department: "23",
      title: "Office",
      firstName: "Anna",
      lastName: "Ivanova",
      phone: "+380931112233"
    },
    {
      id: "3",
      deliveryMethod: "UKRPOSHTA",
      city: "Odesa",
      department: "1",
      title: "Parents",
      firstName: "Oleksii",
      lastName: "Shevchenko",
      phone: "+380977654321"
    }
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(PostAddressValidationScheme),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      department: "",
      deliveryMethod: deliveryMethods[0].value,
      title: "",
      addressDropdown: ""
    }
  });

  const [createOrder, { isSuccess, isError, error }] =
    useCreateOrderV2Mutation();

  useEffect(() => {
    if (isSuccess) {
      openSnackbarWithTimeout({
        variant: "success",
        messageTranslationKey: "deliveryForm.successMessage"
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isErrorWithStatus(error) && error?.status === 409) {
      openSnackbarWithTimeout({
        variant: "error",
        messageTranslationKey: "deliveryForm.errorMessage"
      });
    } else if (isError) {
      openSnackbarWithTimeout({
        variant: "error",
        messageTranslationKey: "deliveryForm.genericErrorMessage"
      });
    }
  }, [isError]);

  const selectedDropdown = useWatch({ control, name: "addressDropdown" });
  const watchedFields = {
    firstName: useWatch({ control, name: "firstName" }),
    lastName: useWatch({ control, name: "lastName" }),
    phone: useWatch({ control, name: "phone" }),
    city: useWatch({ control, name: "city" }),
    department: useWatch({ control, name: "department" }),
    deliveryMethod: useWatch({ control, name: "deliveryMethod" }),
    title: useWatch({ control, name: "title" })
  };

  useAddressSync({
    addresses,
    selectedDropdown,
    watchedFields,
    setValue
  });

  const savedAddressItems = addresses.map((address) => (
    <AddressMenuItem key={address.id} address={address} value={address.title} />
  ));

  const onSubmit = (postAddress: PostAddressExtended) => {
    createOrder({
      userId: id,
      ...postAddress,
      title: postAddress.title || null
    });
  };

  return (
    <AppBox
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="delivery-form"
      data-testid="delivery-form"
    >
      <AppBox className="delivery-form__body">
        <AppTypography
          variant="h3"
          translationKey="deliveryForm.title"
          className="delivery-form__body-title"
        />
        <Controller
          name="addressDropdown"
          control={control}
          render={({ field }) => (
            <AppSelect
              {...field}
              labelId="saved-address"
              label="deliveryForm.savedAddress"
              data-testid="saved-address"
              data-cy="saved-address"
              className="delivery-form__method-select"
              inputProps={{ className: "delivery-form__method-select-input" }}
              renderValue={(selected) => {
                const selectedAddress = addresses.find(
                  (addr) => addr.title === selected
                );
                return selectedAddress ? selectedAddress.title : "";
              }}
            >
              {savedAddressItems}
            </AppSelect>
          )}
        />
        <DeliveryFormFields
          control={control}
          errors={errors}
          checked={checked}
        />
        <AppCheckbox
          variant="dark"
          labelTranslationKey="deliveryForm.checkboxLabel"
          onChange={() => setChecked((prev) => !prev)}
        />
      </AppBox>
      <OrderSummary
        totalPrice={totalPrice}
        totalDiscountedPrice={totalDiscountedPrice}
      />
    </AppBox>
  );
};

export default DeliveryForm;
