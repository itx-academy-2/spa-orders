import { PRODUCT_STATUS_LABELS } from "@/components/product-status-label/ProductStatusLabel.constants";

import { PRODUCT_STATUS } from "@/constants/common";
import { Product } from "@/types/product.types";
import { GetProductStatusResult } from "@/utils/get-product-status/getProductStatus.types";

export const getProductStatus = (
  product?: Product
): GetProductStatusResult => {
  const isEnded = product?.status === PRODUCT_STATUS.ENDED;

  return {
    isEnded,
    labelKey: isEnded ? PRODUCT_STATUS_LABELS.OUT_OF_STOCK : null,
  };
};