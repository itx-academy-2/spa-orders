import { useState } from "react";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import AppBox from "@/components/app-box/AppBox";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppLink from "@/components/app-link/AppLink";
import AppTypography from "@/components/app-typography/AppTypography";
import { ProductCardProps } from "@/components/product-card/ProductCard.types";

import cartIconWithCheck from "@/assets/icons/cart-with-check.svg";
import cartIconWithPlus from "@/assets/icons/cart-with-plus.svg";
import fallbackImage from "@/assets/images/default-product-image.png";
import routePaths from "@/constants/routes";
import useAddToCartOrOpenDrawer from "@/hooks/use-add-to-cart-or-open-drawer/useAddToCartOrOpenDrawer";
import useToggleFavorite from "@/hooks/use-toggle-favorite/useToggleFavorite";
import cn from "@/utils/cn/cn";
import formatPrice from "@/utils/format-price/formatPrice";

import "@/components/product-sale-card/SaleProductCard.scss";

const SaleProductCard = ({
  product,
  isViewHistory = false
}: ProductCardProps) => {
  const { isProductInCart, addToCartOrOpenDrawer } =
    useAddToCartOrOpenDrawer(product);

  const {
    id,
    name,
    image,
    price,
    priceWithDiscount,
    discount,
    description,
    percentageOfTotalOrders
  } = product;

  const roundedPercentage = Math.round(percentageOfTotalOrders || 0);

  const [imgSrc, setImgSrc] = useState(image);
  const { toggle, isFavorite } = useToggleFavorite();

  const handleImageError = () => {
    setImgSrc(fallbackImage);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(product.id);
  };

  const cartIconId = isProductInCart ? "cart-with-check" : "cart-with-plus";
  const cartIconLink = isProductInCart ? cartIconWithCheck : cartIconWithPlus;
  const cartIconFullLink = `${cartIconLink}#${cartIconId}`;

  return (
    <AppBox
      data-testid="product-card"
      className="spa-product-card spa-sale-product-card"
      data-cy="product-card"
    >
      <AppBox
        className="spa-sale-product-card__label"
        data-testid="discount-label"
        >
        -{discount}%
      </AppBox>
      <AppLink
        className="spa-product-card__link-wrapper"
        to={routePaths.productDetails.path(id)}
      >
        <AppBox className="spa-product-card__img">
          <AppBox
            alt={name}
            className="spa-product-card__img-name"
            data-cy="product-card-img"
            component="img"
            src={imgSrc}
            onError={handleImageError}
          />
          {!isViewHistory && (
            <AppBox
              className="spa-product-card__description"
              data-cy="product-card-description"
            >
              <AppTypography className="spa-product-card__description-text">
                {description}
              </AppTypography>
            </AppBox>
          )}
        </AppBox>
        {roundedPercentage > 0 && (
          <AppBox
            className="spa-product-card__best-sellers"
            data-testid="best-sellers"
          >
            <AppTypography
              translationKey="bestsellers.title"
              translationProps={{
                values: {
                  count: roundedPercentage
                }
              }}
            />
          </AppBox>
        )}
        <AppBox>
          <AppTypography
            variant="caption"
            className="spa-product-card__product-name"
          >
            {name}
          </AppTypography>
        </AppBox>
      </AppLink>
      <AppBox className="spa-product-card__footer">
        <AppBox className="spa-sale-product-card__price-container">
          <AppTypography className="spa-sale-product-card__original-price">
            {formatPrice(price)}
          </AppTypography>
          <AppTypography className="spa-product-card__footer-price spa-sale-product-card__price">
            {formatPrice(priceWithDiscount ?? 0)}
          </AppTypography>
        </AppBox>
        <AppBox className="spa-product-card__footer-buttons">
          <AppIconButton
            data-cy="favorite-button"
            onClick={handleFavoriteClick}
            className={cn(
              "spa-product-card__favorite-button",
              isFavorite(product.id) && "spa-product-card__favorite-button--active"
            )}
          >
            {isFavorite(product.id) ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </AppIconButton>
          <AppIconButton
            data-cy="add-to-cart-button"
            onClick={addToCartOrOpenDrawer}
            className={cn(
              "spa-product-card__cart-button",
              isProductInCart && "spa-product-card__cart-button--active"
            )}
          >
            <svg>
              <use data-testid="add-to-cart-icon" href={cartIconFullLink} />
            </svg>
          </AppIconButton>
        </AppBox>
      </AppBox>
    </AppBox>
  );
};

export default SaleProductCard;
