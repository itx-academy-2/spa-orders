import { Control, Controller, FieldErrors } from "react-hook-form";

import { DeliveryFormData } from "@/containers/forms/delivery-form/DeliveryForm.types";

import AppBox from "@/components/app-box/AppBox";
import AppInput from "@/components/app-input/AppInput";
import AppMenuItem from "@/components/app-menu-item/AppMenuItem";
import AppSelect from "@/components/app-select/AppSelect";
import AppTypography from "@/components/app-typography/AppTypography";

import {
  deliveryMethodValues,
  deliveryMethods
} from "@/constants/deliveryMethods";

export type DeliveryMethodType = (typeof deliveryMethodValues)[number];

type DeliveryFormFieldsProps = {
  control: Control<DeliveryFormData>;
  errors: FieldErrors<DeliveryFormData>;
  formatMessage: (descriptor: { id: string }) => string;
  checked: boolean;
};

const DeliveryFormFields = ({
  control,
  errors,
  formatMessage,
  checked
}: DeliveryFormFieldsProps) => {
  const deliveryMethodItems = deliveryMethods.map(
    ({ translationKey, value, image }) => (
      <AppMenuItem
        key={value}
        value={value}
        className="delivery-form__body-item"
      >
        <AppBox
          component="img"
          src={image}
          alt="delivery method"
          className="delivery-form__method-image"
        />
        <AppTypography translationKey={translationKey} />
      </AppMenuItem>
    )
  );
  return (
    <>
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            labelTranslationKey="deliveryForm.firstName"
            error={!!errors.firstName}
            helperText={
              errors.firstName && typeof errors.firstName.message === "string"
                ? formatMessage({ id: errors.firstName.message })
                : undefined
            }
            className="delivery-form__body-input"
          />
        )}
      />
      <Controller
        name="lastName"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            labelTranslationKey="deliveryForm.lastName"
            error={!!errors.lastName}
            helperText={
              errors.lastName && typeof errors.lastName.message === "string"
                ? formatMessage({ id: errors.lastName.message })
                : undefined
            }
            className="delivery-form__body-input"
          />
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            labelTranslationKey="deliveryForm.phone"
            error={!!errors.phone}
            helperText={
              errors.phone && typeof errors.phone.message === "string"
                ? formatMessage({ id: errors.phone.message })
                : undefined
            }
            className="delivery-form__body-input"
          />
        )}
      />
      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            labelTranslationKey="deliveryForm.city"
            error={!!errors.city}
            helperText={
              errors.city && typeof errors.city.message === "string"
                ? formatMessage({ id: errors.city.message })
                : undefined
            }
            className="delivery-form__body-input"
          />
        )}
      />
      <Controller
        name="department"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            labelTranslationKey="deliveryForm.department"
            error={!!errors.department}
            helperText={
              errors.department && typeof errors.department.message === "string"
                ? formatMessage({ id: errors.department.message })
                : undefined
            }
            className="delivery-form__body-input"
          />
        )}
      />
      <Controller
        name="deliveryMethod"
        control={control}
        render={({ field }) => (
          <AppSelect
            {...field}
            labelId="delivery-method"
            label="deliveryForm.postMethod"
            error={!!errors.deliveryMethod}
            data-cy="delivery-method"
            data-testid="delivery-method"
            className="delivery-form__method-select"
            inputProps={{ className: "delivery-form__method-select-input" }}
          >
            {deliveryMethodItems}
          </AppSelect>
        )}
      />
      {checked && (
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <AppInput
              {...field}
              labelTranslationKey="deliveryForm.addressTitle"
              error={!!errors.title}
              helperText={
                errors.title && typeof errors.title.message === "string"
                  ? formatMessage({ id: errors.title.message })
                  : undefined
              }
              className="delivery-form__body-input"
            />
          )}
        />
      )}
    </>
  );
};
export default DeliveryFormFields;
