import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";

import { MenuProps } from "@mui/material/Menu";

import { productCategories } from "@/containers/forms/product-form/ProductForm.constants";
import { ProductFormAdditionalInfoSectionProps } from "@/containers/forms/product-form/ProductForm.types";

import AppBox from "@/components/app-box/AppBox";
import AppCheckbox from "@/components/app-checkbox/AppCheckbox";
import AppInput from "@/components/app-input/AppInput";
import AppMenuItem from "@/components/app-menu-item/AppMenuItem";
import AppSelect from "@/components/app-select/AppSelect";
import AppTypography from "@/components/app-typography/AppTypography";

const CreateAdditionalInfo = ({
  register,
  errors,
  control
}: ProductFormAdditionalInfoSectionProps) => {
  const categoryItems = productCategories.map(({ id, label }) => (
    <AppMenuItem value={id} key={id} data-cy={`product-form-category-${id}`}>
      <AppTypography
        className="product-form__category-select-label"
        translationKey={label}
      />
    </AppMenuItem>
  ));

  const price = useWatch({ control, name: "price" }) || 0;
  const discount = useWatch({ control, name: "discount" }) || 0;

  const finalPrice = useMemo(() => {
    return price - (price * discount) / 100;
  }, [price, discount]);

  return (
    <AppBox className="product-form__container product-form__additional-info-section">
      <AppBox className="product-form__header">
        <AppTypography
          component="h1"
          variant="h3"
          translationKey="dashboardProduct.section.additionalInformation.title"
          className="product-form__header-title"
        />
      </AppBox>
      <AppBox className="product-form__body">
        <AppBox className="product-form__quantity-price-container">
          <AppInput
            fullWidth
            labelTranslationKey="productForm.basePrice.label"
            inputProps={{ min: 0, step: "any" }}
            type="number"
            error={Boolean(errors.price)}
            helperText={errors.price ? errors.price.message : undefined}
            data-testid="product-form-price-input"
            data-cy="product-form-price-input"
            {...register("price", { valueAsNumber: true })}
          />
          <AppInput
            fullWidth
            labelTranslationKey="product.quantity"
            inputProps={{ min: 0 }}
            type="number"
            error={Boolean(errors.quantity)}
            helperText={errors.quantity ? errors.quantity.message : undefined}
            data-testid="product-form-quantity-input"
            data-cy="product-form-quantity-input"
            {...register("quantity", { valueAsNumber: true })}
          />
        </AppBox>
        <AppBox className="product-form__quantity-price-container">
          <AppInput
            className="product-form__discount"
            fullWidth
            labelTranslationKey="productForm.discountPercentage.label"
            inputProps={{ min: 0, step: "any" }}
            type="number"
            data-testid="product-form-discount-input"
            {...register("discount", {
              valueAsNumber: true
            })}
          />
          <AppInput
            fullWidth
            labelTranslationKey="productForm.finalPrice.label"
            inputProps={{ min: 0 }}
            type="number"
            data-testid="product-form-discounted-price-input"
            disabled
            value={finalPrice}
          />
        </AppBox>
        <AppBox className="product-form__category-select-container">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <AppSelect
                fullWidth
                label="product.category"
                inputProps={{ className: "product-form__category-select" }}
                error={Boolean(errors.category)}
                data-testid="product-form-category-select"
                data-cy="product-form-category-select"
                MenuProps={
                  {
                    "data-cy": "product-form-category-menu"
                  } as Partial<MenuProps>
                }
                {...field}
              >
                {categoryItems}
              </AppSelect>
            )}
          />
        </AppBox>
        <Controller
          name="status"
          control={control}
          render={({ field: { onChange, ...props } }) => (
            <AppCheckbox
              className="product-form__visibility-checkbox"
              variant="dark"
              labelTranslationKey="productForm.inputLabel.status"
              labelClassName="product-form__visibility-checkbox-label"
              data-testid="product-form-status-checkbox"
              checked={Boolean(props.value)}
              onChange={(event, checked) => onChange(checked)}
              {...props}
            />
          )}
        />
      </AppBox>
    </AppBox>
  );
};

export default CreateAdditionalInfo;
