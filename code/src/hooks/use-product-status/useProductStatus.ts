import { PRODUCT_STATUS_LABELS } from "@/components/product-status-label/ProductStatusLabel.constants";
import { PRODUCT_STATUS } from "@/constants/common";
import { Product } from "@/types/product.types";
import { UseProductStatusResult } from "@/hooks/use-product-status/useProductStatus.types";

export const useProductStatus = (
  product?: Product
): UseProductStatusResult => {
  const isEnded = product?.status === PRODUCT_STATUS.ENDED;

  return {
    isEnded,
    labelKey: isEnded ? PRODUCT_STATUS_LABELS.OUT_OF_STOCK : null,
  };
};