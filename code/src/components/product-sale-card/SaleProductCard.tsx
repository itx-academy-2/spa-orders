import { useState } from "react";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import AppBox from "@/components/app-box/AppBox";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppLink from "@/components/app-link/AppLink";
import AppTypography from "@/components/app-typography/AppTypography";
import { ProductCardProps } from "@/components/product-card/ProductCard.types";
import ReservedLabel from "@/components/reserved-label/ReservedLabel";
import ProductStatusLabel from "@/components/product-status-label/ProductStatusLabel";
import CircularCountdown from "../circular-countdown/CircularCountdown";

import AuthModal from "@/containers/modals/auth/AuthModal";

import cartIconWithCheck from "@/assets/icons/cart-with-check.svg";
import cartIconWithPlus from "@/assets/icons/cart-with-plus.svg";
import fallbackImage from "@/assets/images/default-product-image.png";
import routePaths from "@/constants/routes";
import useAddToCartOrOpenDrawer from "@/hooks/use-add-to-cart-or-open-drawer/useAddToCartOrOpenDrawer";
import useToggleFavorite from "@/hooks/use-toggle-favorite/useToggleFavorite";
import { useIsProductReserved } from "@/hooks/use-is-product-reserved/useIsProductReserved";
import { getProductStatus } from "@/utils/get-product-status/getProductStatus";
import cn from "@/utils/cn/cn";
import formatPrice from "@/utils/format-price/formatPrice";
import { useModalContext } from "@/context/modal/ModalContext";
import { useIsAuthSelector, useUserRoleSelector } from "@/store/slices/userSlice";
import { ROLES } from "@/constants/common";

import "@/components/product-sale-card/SaleProductCard.scss";

const SaleProductCard = ({
  product,
  isViewHistory = false,
  wishlist = [],
  reservedAt,
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

  const { isReserved } = useIsProductReserved(product.id);

  const { isEnded, labelKey } = getProductStatus(product.status);

  const roundedPercentage = Math.round(percentageOfTotalOrders || 0);

  const [imgSrc, setImgSrc] = useState(image);
  const { toggle, isFavorite } = useToggleFavorite(wishlist);

  const isAuthenticated = useIsAuthSelector();
  const { openModal } = useModalContext();
  const userRole = useUserRoleSelector();

  const isUserOrGuest = !userRole || userRole === ROLES.USER;

  const handleImageError = () => {
    setImgSrc(fallbackImage);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      openModal(<AuthModal />);
      return;
    }

    toggle(product.id);
  };

  const isProductFavorite = isFavorite(product.id);

  const cartIconId = isProductInCart ? "cart-with-check" : "cart-with-plus";
  const cartIconLink = isProductInCart ? cartIconWithCheck : cartIconWithPlus;
  const cartIconFullLink = `${cartIconLink}#${cartIconId}`;

  return (
    <AppBox
      data-testid="product-card"
      className="spa-product-card spa-sale-product-card"
      data-cy="product-card"
    >
      <AppBox className="spa-sale-product-card__labels-timer">
        <AppBox className="spa-sale-product-card__labels">
          <AppBox
            className="spa-sale-product-card__label"
            data-testid="discount-label"
          >
            -{discount}%
          </AppBox>
          {isReserved && <ReservedLabel />}
          {labelKey && <ProductStatusLabel status={labelKey} />}
        </AppBox>
        {reservedAt && (
          <CircularCountdown reservedAt={reservedAt} size={60} />
        )}
      </AppBox>
      <AppLink
        className="spa-product-card__link-wrapper"
        to={routePaths.productDetails.path(id)}
      >
        <AppBox className={cn(
          "spa-product-card__img",
          isEnded && "spa-product-card__img-grayscale"
        )}>
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
            className={cn("spa-product-card__product-name",
              isEnded && "spa-product-card__product-name-disabled"
            )}
          >
            {name}
          </AppTypography>
        </AppBox>
      </AppLink>
      <AppBox className="spa-product-card__footer">
        <AppBox className="spa-sale-product-card__price-container">
          <AppTypography
            className={cn("spa-sale-product-card__original-price",
              isEnded && "spa-sale-product-card__original-price-disabled"
            )}
          >
            {formatPrice(price)}
          </AppTypography>
          <AppTypography
            className={cn("spa-product-card__footer-price spa-sale-product-card__price",
              isEnded && "spa-sale-product-card__price-disabled"
            )}
          >
            {formatPrice(priceWithDiscount ?? 0)}
          </AppTypography>
        </AppBox>
        {isUserOrGuest && (
          <AppBox className="spa-product-card__footer-buttons">
            <AppIconButton
              data-testid="favorite-button"
              onClick={handleFavoriteClick}
              className={cn(
                "spa-product-card__favorite-button",
                isProductFavorite && "spa-product-card__favorite-button--active"
              )}
              disabled={isEnded}
            >
              {isProductFavorite ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </AppIconButton>
            <AppIconButton
              data-cy="add-to-cart-button"
              data-testid="add-to-cart-button"
              onClick={addToCartOrOpenDrawer}
              className={cn(
                "spa-product-card__cart-button",
                isProductInCart && "spa-product-card__cart-button--active"
              )}
              disabled={isEnded}
            >
              <svg>
                <use data-testid="add-to-cart-icon" href={cartIconFullLink} />
              </svg>
            </AppIconButton>
          </AppBox>
        )}
      </AppBox>
    </AppBox>
  );
};

export default SaleProductCard;
