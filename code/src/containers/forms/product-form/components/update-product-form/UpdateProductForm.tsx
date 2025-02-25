import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  ProductFormValues,
  UpdateProductFormProps
} from "@/containers/forms/product-form/ProductForm.types";
import AdditionalInfo from "@/containers/forms/product-form/components/additional-info/AdditionalInfo";
import ImagePreview from "@/containers/forms/product-form/components/image/Image";
import MainInfo from "@/containers/forms/product-form/components/main-info/MainInfo";
import useUpdateProduct from "@/containers/forms/product-form/hooks/use-update-product/useUpdateProduct";
import filterDirtyFields from "@/containers/forms/product-form/utils/filter-dirty-fields/filterDirtyFields";
import getDefaultValues from "@/containers/forms/product-form/utils/get-default-values/getDefaultValues";
import getRequestBodyFromValues from "@/containers/forms/product-form/utils/get-request-body-from-values/getRequestBodyFromValues";

import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppTypography from "@/components/app-typography/AppTypography";

import productScheme from "@/utils/validators/productScheme";

import "@/containers/forms/product-form/ProductForm.scss";

const UpdateProductForm = ({ product }: UpdateProductFormProps) => {
  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    formState: { errors, dirtyFields, isDirty }
  } = useForm<ProductFormValues>({
    defaultValues: getDefaultValues(product),
    resolver: zodResolver(productScheme)
  });

  const [updateProduct, { isLoading }] = useUpdateProduct();
  const [removeProductDiscount] = useUpdateProduct({
    onSuccess: () => {
      setValue("discount", 0);
      setValue("priceWithDiscount", getValues().price);
    }
  });

  const onSubmit = async (values: ProductFormValues) => {
    if (!isDirty) return;

    const filteredFields = filterDirtyFields(values, dirtyFields);
    const body = getRequestBodyFromValues(filteredFields);

    await updateProduct({ ...body, productId: product.id });
  };

  const { formatMessage } = useIntl();

  const handleRemoveDiscount = () => {
    const confirmResult = confirm(
      formatMessage({ id: "productForm.discountRemoval.confirmation" })
    );

    if (confirmResult) {
      removeProductDiscount({
        discount: null,
        productId: product.id
      });
    }
  };

  return (
    <AppBox component="form" onSubmit={handleSubmit(onSubmit)}>
      <AppBox className="product-form">
        <ImagePreview control={control} register={register} errors={errors} />
        <AdditionalInfo
          control={control}
          register={register}
          errors={errors}
          onRemoveDiscount={handleRemoveDiscount}
          showRemoveDiscountBtn={Boolean(product.discount)}
        />
        <AppBox className="product-form__main-info-section">
          <MainInfo register={register} errors={errors} />
          <AppButton
            className="product-form__footer-button"
            data-cy="update-product-form-button"
            type="submit"
            isLoading={isLoading}
            fullWidth
          >
            <AppTypography translationKey="productForm.update.submit" />
          </AppButton>
        </AppBox>
      </AppBox>
    </AppBox>
  );
};

export default UpdateProductForm;
