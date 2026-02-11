import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

import { TRANSLATION_KEYS } from "@/components/product-status-label/ProductStatusLabel.constants";
import { ProductStatusLabelProps } from "@/components/product-status-label/ProductStatusLabel.types";

import "@/components/product-status-label/ProductStatusLabel.scss";

const ProductStatusLabel = ({
  status,
}: ProductStatusLabelProps) => {

  return (
    <AppBox className="spa-product-status-label">
      <AppTypography
        translationKey={TRANSLATION_KEYS[status]}
        variant="caption-small"
      />
    </AppBox>
  );
};

export default ProductStatusLabel;