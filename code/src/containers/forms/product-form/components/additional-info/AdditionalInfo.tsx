import { SyntheticEvent } from "react";
import { Controller } from "react-hook-form";

import CancelIcon from "@mui/icons-material/Cancel";
import { MenuProps } from "@mui/material/Menu";

import { productCategories } from "@/containers/forms/product-form/ProductForm.constants";
import {
  ProductFormAdditionalInfoSectionProps,
  ProductFormControllerRenderFunctionProps
} from "@/containers/forms/product-form/ProductForm.types";
import useCreateProduct from "@/containers/forms/product-form/hooks/use-create-product/useCreateProduct";

import AppBox from "@/components/app-box/AppBox";
import AppCheckbox from "@/components/app-checkbox/AppCheckbox";
import AppFormHelperText from "@/components/app-form-helper-text/AppFormHelperText";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppInput from "@/components/app-input/AppInput";
import AppMenuItem from "@/components/app-menu-item/AppMenuItem";
import AppSelect from "@/components/app-select/AppSelect";
import AppTooltip from "@/components/app-tooltip/AppTooltip";
import AppTypography from "@/components/app-typography/AppTypography";

const AdditionalInfo = ({
  register,
  errors,
  control,
  showRemoveDiscountBtn,
  percentageOfTotalOrders,
  onRemoveDiscount
}: ProductFormAdditionalInfoSectionProps) => {
  const [, discountedProductsCount] = useCreateProduct();

  const disabledDiscount =
    typeof discountedProductsCount === "number" &&
    discountedProductsCount === 10;

  const categoryErrorElement = errors.category && (
    <AppFormHelperText className="product-form__category-select-helper" error>
      {errors.category.message}
    </AppFormHelperText>
  );

  const categoryItems = productCategories.map(({ id, label }) => (
    <AppMenuItem value={id} key={id} data-cy={`product-form-category-${id}`}>
      <AppTypography
        className="product-form__category-select-label"
        translationKey={label}
      />
    </AppMenuItem>
  ));

  const selectControllerRenderFunction = ({
    field: handlers
  }: ProductFormControllerRenderFunctionProps) => (
    <>
      <AppSelect
        fullWidth
        label="product.category"
        inputProps={{
          className: "product-form__category-select"
        }}
        error={Boolean(errors.category)}
        data-testid="product-form-category-select"
        data-cy="product-form-category-select"
        MenuProps={
          {
            "data-cy": "product-form-category-menu"
          } as Partial<MenuProps>
        }
        {...handlers}
      >
        {categoryItems}
      </AppSelect>
      {categoryErrorElement}
    </>
  );

  const checkboxControllerRenderFunction = ({
    field: { onChange, ...props }
  }: ProductFormControllerRenderFunctionProps) => {
    const handleChange = (_: SyntheticEvent, checked: boolean) => {
      onChange(checked);
    };

    return (
      <AppCheckbox
        className="product-form__visibility-checkbox"
        variant="dark"
        labelTranslationKey="productForm.inputLabel.status"
        labelClassName="product-form__visibility-checkbox-label"
        data-testid="product-form-status-checkbox"
        checked={Boolean(props.value)}
        onChange={handleChange}
        {...props}
      />
    );
  };

  const percentageOfOrders = Math.round(percentageOfTotalOrders || 0);

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
          <AppBox className="product-form__discount-container">
            <Controller
              name="discount"
              control={control}
              render={({ field: { onChange, value, ...fieldProps } }) => {
                const tooltipTitle = disabledDiscount
                  ? "productForm.discountedProductLimit.label"
                  : undefined;

                return (
                  <AppTooltip titleTranslationKey={tooltipTitle}>
                    <AppInput
                      {...fieldProps}
                      className="product-form__discount"
                      fullWidth
                      labelTranslationKey="productForm.discountPercentage.label"
                      inputProps={{ min: 0, step: "any", max: 100 }}
                      type="number"
                      data-testid="product-form-discount-input"
                      disabled={disabledDiscount}
                      value={disabledDiscount && value === 0 ? "" : value ?? ""}
                      onChange={(e) =>
                        onChange(e.target.value ? Number(e.target.value) : 0)
                      }
                    />
                  </AppTooltip>
                );
              }}
            />
            {showRemoveDiscountBtn && (
              <AppIconButton
                className="product-form__discount-remove"
                data-testid="product-form-discount-remove"
                onClick={onRemoveDiscount}
              >
                <CancelIcon fontSize="small" color="warning" />
              </AppIconButton>
            )}
          </AppBox>
          <AppInput
            fullWidth
            labelTranslationKey="productForm.finalPrice.label"
            inputProps={{ min: 0 }}
            type="number"
            data-testid="product-form-discounted-price-input"
            disabled
            {...register("priceWithDiscount", {
              valueAsNumber: true
            })}
          />
        </AppBox>
        <AppBox className="product-form__category-select-container">
          <Controller
            name="category"
            control={control}
            render={selectControllerRenderFunction}
          />
        </AppBox>
        <Controller
          name="status"
          control={control}
          render={checkboxControllerRenderFunction}
        />
        {Boolean(percentageOfTotalOrders) && (
          <AppBox
            className="product-form__bestseller-label"
            data-testid="product-form-bestseller-label"
          >
            <AppTypography
              translationKey="bestsellers.title"
              translationProps={{
                values: {
                  count: percentageOfOrders
                }
              }}
            />
          </AppBox>
        )}
      </AppBox>
    </AppBox>
  );
};

export default AdditionalInfo;
