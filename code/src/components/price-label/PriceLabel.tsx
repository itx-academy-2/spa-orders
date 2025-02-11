import { FC } from "react";

import AppTypography from "@/components/app-typography/AppTypography";
import { PriceLabelProps } from "@/components/price-label/PriceLabel.types";

import cn from "@/utils/cn/cn";
import formatPrice from "@/utils/format-price/formatPrice";

import "@/components/price-label/PriceLabel.scss";

const PriceLabel: FC<PriceLabelProps> = ({
  price,
  priceWithDiscount,
  align = "horizontal",
  className,
  originalPriceSize = "caption",
  originalPriceWeight = "regular",
  discountedPriceSize = "body",
  discountedPriceWeight = "extra-bold"
}) => {
  if (!priceWithDiscount) {
    return (
      <AppTypography
        variant="body"
        component="p"
        fontWeight="extra-bold"
        data-testid="price-label-no-discount"
        className={className}
      >
        {formatPrice(price)}
      </AppTypography>
    );
  }

  return (
    <div className={cn("price-label", `price-label--${align}`, className)}>
      <AppTypography
        className="price-label__original-price"
        variant={originalPriceSize}
        component="p"
        fontWeight={originalPriceWeight}
        data-testid="price-label-original-price"
      >
        {formatPrice(price)}
      </AppTypography>
      <AppTypography
        className="price-label__discounted-price"
        variant={discountedPriceSize}
        component="p"
        fontWeight={discountedPriceWeight}
        data-testid="price-label-discounted-price"
      >
        {formatPrice(priceWithDiscount)}
      </AppTypography>
    </div>
  );
};

export default PriceLabel;
