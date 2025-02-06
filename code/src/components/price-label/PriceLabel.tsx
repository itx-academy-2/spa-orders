import { FC } from "react";

import AppTypography from "@/components/app-typography/AppTypography";
import { PriceLabelProps } from "@/components/price-label/PriceLabel.types";

import cn from "@/utils/cn/cn";
import formatPrice from "@/utils/format-price/formatPrice";

import "@/components/price-label/PriceLabel.scss";

const PriceLabel: FC<PriceLabelProps> = ({
  price,
  priceWithDiscount,
  align = "horizontal"
}) => {
  if (!priceWithDiscount) {
    return (
      <AppTypography
        variant="body"
        component="p"
        fontWeight="extra-bold"
        data-testid="price-label-no-discount"
      >
        {formatPrice(price)}
      </AppTypography>
    );
  }

  return (
    <div className={cn("price-label", `price-label--${align}`)}>
      <AppTypography
        className="price-label__original-price"
        variant="caption"
        component="p"
        data-testid="price-label-original-price"
      >
        {formatPrice(price)}
      </AppTypography>
      <AppTypography
        className="price-label__discounted-price"
        variant="body"
        component="p"
        fontWeight="extra-bold"
        data-testid="price-label-discounted-price"
      >
        {formatPrice(priceWithDiscount)}
      </AppTypography>
    </div>
  );
};

export default PriceLabel;
