import { useEffect, useState } from "react";

import AppBox from "@/components/app-box/AppBox";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppLink from "@/components/app-link/AppLink";
import AppTypography from "@/components/app-typography/AppTypography";
import { ProductCardProps } from "@/components/product-card/ProductCard.types";

import cartIconWithCheck from "@/assets/icons/cart-with-check.svg";
import cartIconWithPlus from "@/assets/icons/cart-with-plus.svg";
import cn from "@/utils/cn/cn";
import formatPrice from "@/utils/format-price/formatPrice";

import "@/components/product-card/ProductCard.scss";

const ProductCard = ({
  product,
  isInCart,
  isUserAuthorized,
  onCartIconClick
}: ProductCardProps) => {
  const [isProductInCart, setIsProductInCart] = useState(isInCart);

  useEffect(() => {
    setIsProductInCart(isInCart);
  }, [isInCart]);

  const handleCartIconClick = () => {
    isUserAuthorized && setIsProductInCart(true);
    onCartIconClick({ ...product, isInCart });
  };

  const cartIconId = isProductInCart ? "cart-with-check" : "cart-with-plus";
  const cartIconLink = isProductInCart ? cartIconWithCheck : cartIconWithPlus;
  const cartIconFullLink = `${cartIconLink}#${cartIconId}`;

  return (
    <AppBox
      data-testid="product-card"
      className="spa-product-card"
      data-cy="product-card"
    >
      <AppLink className="spa-product-card__link-wrapper" to="/">
        <AppBox className="spa-product-card__img">
          <AppBox
            alt={product.name}
            className="spa-product-card__img-name"
            data-cy="product-card-img"
            component="img"
            src={product.image}
          />
          <AppBox
            className="spa-product-card__description"
            data-cy="product-card-description"
          >
            <AppTypography>{product.description}</AppTypography>
          </AppBox>
        </AppBox>
        <AppBox>
          <AppTypography variant="caption">{product.name}</AppTypography>
        </AppBox>
      </AppLink>
      <AppBox className="spa-product-card__footer">
        <AppTypography className="spa-product-card__footer-price">
          {formatPrice(product.price)}
        </AppTypography>
        <AppIconButton
          onClick={handleCartIconClick}
          className={cn(
            "spa-product-card__cart-button",
            isProductInCart && "spa-product-card__cart-button--active"
          )}
        >
          <svg>
            <use href={cartIconFullLink} />
          </svg>
        </AppIconButton>
      </AppBox>
    </AppBox>
  );
};

export default ProductCard;
