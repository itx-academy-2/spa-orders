import { PRODUCT_STATUS_LABELS } from "@/components/product-status-label/ProductStatusLabel.constants";

export type ProductStatusLabelKey = (typeof PRODUCT_STATUS_LABELS)[keyof typeof PRODUCT_STATUS_LABELS] | null;

export type UseProductStatusResult = {
    isEnded: boolean;
    labelKey: ProductStatusLabelKey;
};