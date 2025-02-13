import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppTypography from "@/components/app-typography/AppTypography";
import PriceLabel from "@/components/price-label/PriceLabel";

import formatPrice from "@/utils/format-price/formatPrice";

import "@/containers/order-summary/OrderSummary.scss";

type OrderSummaryProps = {
  totalPrice: number;
  totalDiscountedPrice?: number;
  isDisabled: boolean;
  isLoading: boolean;
};

const OrderSummary = ({
  totalPrice,
  isDisabled,
  isLoading,
  totalDiscountedPrice
}: OrderSummaryProps) => {
  const discountedTotalPrice = formatPrice(totalDiscountedPrice ?? totalPrice);

  const hasItemDiscount =
    totalDiscountedPrice !== undefined && totalDiscountedPrice < totalPrice;

  return (
    <AppBox className="spa-cart-page__order-summary">
      <AppTypography
        className="spa-cart-page__order-summary--label"
        variant="h3"
        component="h1"
        translationKey="orderSummary.label"
        data-testid="orderSummaryLabel"
      />
      <AppBox className="spa-order-summary__details">
        <AppBox className="spa-order-summary__row">
          <AppTypography
            className="spa-order-summary__text"
            translationKey="subtotal.label"
            data-testid="subtotalLabel"
          />
          <PriceLabel
            price={totalPrice}
            priceWithDiscount={
              hasItemDiscount ? totalDiscountedPrice : undefined
            }
          />
        </AppBox>
        <AppBox className="spa-order-summary__row">
          <AppTypography
            translationKey="delivery.label"
            data-testid="deliveryLabel"
          />
          <AppTypography translationKey="free.label" data-testid="freeLabel" />
        </AppBox>
        <AppTypography
          className="spa-order-summary__underline-text"
          translationKey="country.label"
          data-testid="countryLabel"
        />
        <AppBox className="spa-order-summary__row spa-order-summary__total-line">
          <AppTypography
            className="spa-order-summary__total"
            variant="subtitle2"
            translationKey="total.label"
            data-testid="totalLabel"
          />
          <AppTypography variant="subtitle2">
            {discountedTotalPrice}
          </AppTypography>
        </AppBox>
      </AppBox>
      <AppButton
        disabled={isDisabled}
        isLoading={isLoading}
        type="submit"
        className="spa-order-summary__button"
        variant="contained"
        size="medium"
        data-testid="createOrderButton"
      >
        <AppTypography translationKey="createOrder.label" />
      </AppButton>
    </AppBox>
  );
};

export default OrderSummary;
