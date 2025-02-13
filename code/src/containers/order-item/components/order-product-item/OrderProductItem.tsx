import AppBadge from "@/components/app-badge/AppBadge";
import AppBox from "@/components/app-box/AppBox";
import AppLink from "@/components/app-link/AppLink";
import AppTypography from "@/components/app-typography/AppTypography";
import PriceLabel from "@/components/price-label/PriceLabel";

import routes from "@/constants/routes";
import { OrderItem } from "@/types/order.types";

import "@/containers/order-item/components/order-product-item/OrderProductItem.scss";

const OrderProductItem = (order: OrderItem) => {
  const { price, id, image, name, description, priceWithDiscount, discount } =
    order.product;

  const hasDiscount = !!priceWithDiscount;

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
          <PriceLabel
            price={price}
            priceWithDiscount={priceWithDiscount}
            align="vertical"
          />
          <AppTypography
            className="spa-order-product__quantity"
            variant="caption"
            component="p"
            fontWeight="extra-bold"
          >
            &times; {order.quantity}
          </AppTypography>
        </AppBox>
      </AppBox>
      <PriceLabel
        price={order.price}
        priceWithDiscount={order.priceWithDiscount}
        align="vertical"
      />
    </AppLink>
  );
};

export default OrderProductItem;
