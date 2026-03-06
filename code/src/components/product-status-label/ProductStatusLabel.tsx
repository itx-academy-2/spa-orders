import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";
import { TRANSLATION_KEYS } from "@/components/product-status-label/ProductStatusLabel.constants";
import { ProductStatusLabelProps } from "@/components/product-status-label/ProductStatusLabel.types";

import cn from "@/utils/cn/cn";

import "@/components/product-status-label/ProductStatusLabel.scss";


const ProductStatusLabel = ({
  status,
  className
}: ProductStatusLabelProps) => {

  return (
    <AppBox className={cn("spa-product-status-label", className)}>
      <AppTypography
        translationKey={TRANSLATION_KEYS[status]}
        variant="caption-small"
        data-testid="product-status-label"
      />
    </AppBox>
  );
};

export default ProductStatusLabel;