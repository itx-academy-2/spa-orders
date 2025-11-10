import { useIntl } from "react-intl";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import AuthModal from "@/containers/modals/auth/AuthModal";
import PageLoadingFallback from "@/containers/page-loading-fallback/PageLoadingFallback";

import AppBadge from "@/components/app-badge/AppBadge";
import AppBox from "@/components/app-box/AppBox";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppTypography from "@/components/app-typography/AppTypography";
import PriceLabel from "@/components/price-label/PriceLabel";
import ProductDescription from "@/components/product-description/ProductDescription";

import { deliveryMethods as deliveryMethodsData } from "@/constants/deliveryMethods";
import { useLocaleContext } from "@/context/i18n/I18nProvider";
import useErrorPageRedirect from "@/hooks/use-error-page-redirect/useErrorPageRedirect";
import useTrackVisits from "@/hooks/use-track-visits/useTrackVisits";
import useToggleFavorite from "@/hooks/use-toggle-favorite/useToggleFavorite";
import { ProductDetailsPageParams } from "@/pages/product-details/ProductDetails.types";
import { productNotFoundRedirectConfig } from "@/pages/product-details/ProductsDetailsPage.constants";
import BuyNowButton from "@/pages/product-details/components/buy-now-button/BuyNowButton";
import ReserveButton from "@/pages/product-details/components/reserve-button/ReserveButton";
import { useGetUserProductByIdQuery } from "@/store/api/productsApi";
import getCategoryFromTags from "@/utils/get-category-from-tags/getCategoryFromTags";
import isErrorWithStatus from "@/utils/is-error-with-status/isErrorWithStatus";
import cn from "@/utils/cn/cn";
import { Product } from "@/types/product.types";
import { useModalContext } from "@/context/modal/ModalContext";
import { useIsAuthSelector, useUserRoleSelector } from "@/store/slices/userSlice";
import { ROLES } from "@/constants/common";

import "@/pages/product-details/components/product-details-container/ProductDetailsContainer.scss";

type ProductDetailsContainerProps = ProductDetailsPageParams & {
  wishlist: Product[];
};

const ProductDetailsContainer = ({
  productId,
  wishlist
}: ProductDetailsContainerProps) => {
  useTrackVisits("product", productId);

  const { renderRedirectComponent } = useErrorPageRedirect();
  const { locale } = useLocaleContext();
  const { formatMessage } = useIntl();
  const { toggle, isFavorite } = useToggleFavorite(wishlist);
  const {
    data: product,
    isLoading,
    error
  } = useGetUserProductByIdQuery({
    productId,
    lang: locale
  });
  
  const isAuthenticated = useIsAuthSelector();
  const { openModal } = useModalContext();
  const userRole = useUserRoleSelector();

  const isUserOrGuest = !userRole || userRole === ROLES.USER;

  if (isLoading) {
    return <PageLoadingFallback />;
  }

  const isNotFoundOnServer =
    isErrorWithStatus(error) && (error.status === 404 || error.status === 400);

  if (isNotFoundOnServer || !product) {
    return renderRedirectComponent(productNotFoundRedirectConfig);
  }

  if (error) {
    return (
      <AppTypography
        variant="h3"
        translationKey="productDetailsPage.loadErrorMessage"
      />
    );
  }

  const categoryTag = getCategoryFromTags(product.tags);

  const categoryBadge = categoryTag && (
    <AppBadge
      badgeContent={
        <AppTypography
          variant="caption-small"
          translationKey={`productsAll.${categoryTag}`}
        />
      }
    />
  );

  const deliveryMethods = deliveryMethodsData.map(
    ({ image, translationKey, value }) => {
      const translatedDeliveryMethodName = formatMessage({
        id: translationKey
      });

      return (
        <AppBox className="product-details__delivery-method" key={value}>
          <AppBox
            component="img"
            className="product-details__delivery-method-image"
            src={image}
            alt={translatedDeliveryMethodName}
          />
          <AppTypography>{translatedDeliveryMethodName}</AppTypography>
        </AppBox>
      );
    }
  );

  const inStockTypography = product.quantity > 0 && (
    <AppTypography
      className="product-details__in-stock"
      fontWeight="extra-bold"
      variant="caption"
      translationKey="productDetailsPage.inStock"
    />
  );

  const productWithId = { ...product, id: productId };

  const percentageOfOrders = Math.round(product.percentageOfTotalOrders || 0);

  const bestsellerBadge = Boolean(percentageOfOrders) && (
    <AppBadge
      data-testid="product-details-bestseller-label"
      slotProps={{
        badge: {
          className: "product-details__bestseller-label"
        }
      }}
      badgeContent={
        <AppTypography
          variant="caption-small"
          translationKey="bestsellers.title"
          translationProps={{
            values: {
              count: percentageOfOrders
            }
          }}
        />
      }
    />
  );

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      openModal(<AuthModal />);
      return;
    }
    
    toggle(productId);
  };

  const isProductFavorite = isFavorite(productId);

  return (
    <AppBox className="product-details">
      <AppBox className="product-details__image-wrapper">
        <AppBox component="img" src={product.image} alt={product.name} />
        {product.discount! > 0 && (
          <AppBox className="product-details__image-label">
            -{product.discount}%
          </AppBox>
        )}
      </AppBox>
      <AppBox className="product-details__summary">
        <AppBox style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {categoryBadge}
          {bestsellerBadge}
        </AppBox>
        <AppTypography variant="h3" component="h1">
          {product.name}
        </AppTypography>
        <AppBox>
          <AppBox className="product-details__section">
            {inStockTypography}
            <AppBox className="product-details__buy-action">
              <PriceLabel
                price={product.price}
                priceWithDiscount={product.priceWithDiscount}
                className="custom-price-label"
                originalPriceSize="h3"
                originalPriceWeight="bold"
                discountedPriceSize="h3"
                discountedPriceWeight="bold"
              />
              { isUserOrGuest && (
                <AppBox className="product-details__buy-favorite-buttons">
                  <ReserveButton />
                  <AppIconButton
                    data-cy="favorite-button"
                    onClick={handleFavoriteClick}
                    className={cn(
                      "product-details__favorite-button",
                      isProductFavorite && "product-details__favorite-button--active"
                    )}
                  >
                  {isProductFavorite ? (
                    <FavoriteIcon fontSize="medium" />
                  ) : (
                    <FavoriteBorderIcon fontSize="medium" />
                  )}
                  </AppIconButton>
                  <BuyNowButton productWithId={productWithId} />
                </AppBox>
              )}
            </AppBox>
          </AppBox>
          <AppBox className="product-details__section">
            <AppTypography
              className="product-details__section-caption"
              variant="caption-small"
              translationKey="productDetailsPage.deliveryMethodsCaption"
            />
            <AppBox className="product-details__delivery-method-container">
              {deliveryMethods}
            </AppBox>
          </AppBox>
          <AppBox className="product-details__section">
            <AppTypography
              className="product-details__section-caption"
              variant="caption-small"
              translationKey="productDetailsPage.descriptionCaption"
            />
            <ProductDescription description={product.description} />
          </AppBox>
        </AppBox>
      </AppBox>
    </AppBox>
  );
};

export default ProductDetailsContainer;
