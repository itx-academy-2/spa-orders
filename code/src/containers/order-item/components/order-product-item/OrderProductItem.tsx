import AppBadge from "@/components/app-badge/AppBadge";
import AppBox from "@/components/app-box/AppBox";
import AppLink from "@/components/app-link/AppLink";
import AppTypography from "@/components/app-typography/AppTypography";

import routes from "@/constants/routes";
import { Product } from "@/types/product.types";
import formatPrice from "@/utils/format-price/formatPrice";

import "@/containers/order-item/components/order-product-item/OrderProductItem.scss";

type OrderProductItemProps = {
  product: Product;
  quantity: number;
  totalPrice: number;
};

const OrderProductItem = ({
  product,
  quantity,
  totalPrice
}: OrderProductItemProps) => {
  const { price, id, image, name, description, priceWithDiscount, discount } =
    product;

  const hasDiscount = product.discount && product.discount > 0;

  return (
    <AppLink
      to={routes.productDetails.path(id)}
      className="spa-order-product__container"
    >
      <AppBox className="spa-order-product__info">
        <AppBox className="spa-order-product__image-container">
          <AppBox
            className="spa-order-product__image"
            component="img"
            src={image}
            alt={name}
          />
          {hasDiscount ? (
            <AppBadge
              className="spa-order-product__discount-badge"
              data-testid="spa-order-product-discount-badge"
              badgeContent={
                <AppTypography variant="caption-small">
                  {`-${discount}%`}
                </AppTypography>
              }
              variant="danger"
              size="small"
            />
          ) : null}
        </AppBox>

        <AppBox className="spa-order-product__description">
          <AppTypography
            className="spa-order-product__description-title"
            variant="body"
            fontWeight="extra-bold"
            component="p"
          >
            {name}
          </AppTypography>
          <AppTypography
            variant="caption-small"
            component="p"
            className="spa-order-product__description-caption"
          >
            {description}
          </AppTypography>
        </AppBox>
        <AppBox className="spa-order-product__price-container">
          {hasDiscount ? (
            <AppBox
              className="spa-order-product__discounted-price-container"
              data-testid="spa-order-product-discounted-price-container"
            >
              <AppTypography
                className="spa-order-product__price spa-order-product__price-old"
                variant="caption"
                component="p"
                fontWeight="extra-bold"
              >
                {formatPrice(price)}
              </AppTypography>
              <AppTypography
                className="spa-order-product__price spa-order-product__price-discounted"
                variant="caption"
                component="p"
                fontWeight="extra-bold"
              >
                {formatPrice(priceWithDiscount!)}
              </AppTypography>
            </AppBox>
          ) : (
            <AppTypography
              className="spa-order-product__price"
              variant="caption"
              component="p"
              fontWeight="extra-bold"
            >
              {formatPrice(price)}
            </AppTypography>
          )}
          <AppTypography
            className="spa-order-product__quantity"
            variant="caption"
            component="p"
            fontWeight="extra-bold"
          >
            x {quantity}
          </AppTypography>
        </AppBox>
      </AppBox>
      <AppTypography variant="body" component="p" fontWeight="extra-bold">
        {formatPrice(totalPrice)}
      </AppTypography>
    </AppLink>
  );
};

export default OrderProductItem;
