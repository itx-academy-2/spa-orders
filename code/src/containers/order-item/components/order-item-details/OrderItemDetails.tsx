import OrderProductItem from "@/containers/order-item/components/order-product-item/OrderProductItem";

import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";
import PriceLabel from "@/components/price-label/PriceLabel";

import { PostAddress } from "@/types/delivery.types";
import { UserOrder } from "@/types/order.types";
import extractFullname from "@/utils/extract-fullname/extractFullname";

import "@/containers/order-item/components/order-item-details/OrderItemDetails.scss";

type OrderItemDetailsProps = {
  order: UserOrder;
};

const postAddressFields: Record<keyof PostAddress, string> = {
  city: "orderProductItem.details.city",
  department: "orderProductItem.details.department",
  deliveryMethod: "orderProductItem.details.deliveryMethod"
};

const OrderItemDetails = ({ order }: OrderItemDetailsProps) => {
  const { receiver, postAddress, orderItems } = order;

  const fullName = extractFullname(receiver);

  const postAddressFieldsList = Object.entries(postAddressFields).map(
    ([key, label]) => (
      <AppBox key={key} className="spa-order-details__address-fields">
        <AppTypography variant="caption" translationKey={label} />
        <AppTypography variant="caption" fontWeight="extra-bold">
          {postAddress[key as keyof typeof postAddress]}
        </AppTypography>
      </AppBox>
    )
  );

  const orderProductItems = orderItems.map((order) => (
    <OrderProductItem
      key={order.product.id}
      price={order.price}
      priceWithDiscount={order.priceWithDiscount}
      quantity={order.quantity}
      product={order.product}
      discount={order.discount}
    />
  ));

  return (
    <AppBox className="spa-order-details">
      <AppBox className="spa-order-details__delivery">
        <AppBox>
          <AppTypography
            variant="caption-small"
            component="p"
            translationKey="orderProductItem.details.orderReceiver"
          />
          <AppBox className="spa-order-details__receiver">
            <AppTypography
              className="spa-order-details__receiver-item"
              variant="caption"
              fontWeight="extra-bold"
            >
              {fullName}
            </AppTypography>
            <AppTypography
              className="spa-order-details__receiver-item"
              variant="caption"
              fontWeight="extra-bold"
            >
              {receiver.email}
            </AppTypography>
          </AppBox>
        </AppBox>
        <AppBox className="spa-order-details__address">
          <AppTypography
            variant="caption-small"
            component="p"
            className="spa-order-details__address-label"
            translationKey="orderProductItem.details.receiverAddress"
          />
          {postAddressFieldsList}
        </AppBox>
      </AppBox>
      <AppBox className="spa-order-details__divider"></AppBox>
      <AppBox className="spa-order-product">
        <AppBox className="spa-order-product__items">
          {orderProductItems}
        </AppBox>
        <AppBox className="spa-order-details__total">
          <AppTypography
            variant="subtitle1"
            translationKey="orderProductItem.details.totalPrice"
          />
          <PriceLabel
            price={order.total}
            priceWithDiscount={order.totalWithDiscount}
          />
        </AppBox>
      </AppBox>
    </AppBox>
  );
};

export default OrderItemDetails;
