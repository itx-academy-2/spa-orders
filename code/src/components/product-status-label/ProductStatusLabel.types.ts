import { PRODUCT_STATUS_LABELS } from "@/components/product-status-label/ProductStatusLabel.constants";

export type ProductStatusLabelProps = {
    status: (typeof PRODUCT_STATUS_LABELS)[keyof typeof PRODUCT_STATUS_LABELS];
    className?: string;
};