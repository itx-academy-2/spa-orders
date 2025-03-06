import { ProductFormValues } from "@/containers/forms/product-form/ProductForm.types";

import { ProductBody } from "@/types/product.types";

const getRequestBodyFromValues = <T = ProductBody>(
  values: Partial<ProductFormValues>
): T => {
  const valuesKeys = Object.keys(values) as (keyof ProductFormValues)[];

  const result = valuesKeys.reduce((acc, key) => {
    if (key === "productTranslations" && values.productTranslations) {
      const translations = values.productTranslations.filter(
        (item) => item.name || item.description
      );

      return {
        ...acc,
        productTranslations: translations
      };
    } else if (key === "status") {
      return { ...acc, status: values.status ? "VISIBLE" : "HIDDEN" };
    } else if (key === "category") {
      return { ...acc, tagIds: [values.category] };
    } else if (key === "discount") {
      if (
        values.discount !== undefined &&
        values.discount !== null &&
        values.discount > 0
      ) {
        return { ...acc, discount: values.discount };
      }
      return acc;
    }

    return { ...acc, [key]: values[key] };
  }, {}) as ProductBody;

  return result as T;
};

export default getRequestBodyFromValues;
