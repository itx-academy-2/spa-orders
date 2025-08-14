import DeleteIcon from "@mui/icons-material/Delete";

import AppBadge from "@/components/app-badge/AppBadge";
import AppBox from "@/components/app-box/AppBox";
import AppTooltip from "@/components/app-tooltip/AppTooltip";
import AppTypography from "@/components/app-typography/AppTypography";
import QuantitySelector from "@/components/quantity-selector/QuantitySelector";

import { CartItemProps } from "@/types/cart.types";
import formatPrice from "@/utils/format-price/formatPrice";

import "@/pages/cart/components/cart-item/CartItem.scss";

const CartItem = ({ item, onRemove, onQuantityChange }: CartItemProps) => {
  const handleRemoveCartItem = () => {
    onRemove(item);
  };

  const hasDiscount = !!item.productPriceWithDiscount;

  const ordersPercentage = item.percentageOfTotalOrders;

  const roundedPercentage = Math.round(ordersPercentage || 0);

  const totalPrice = formatPrice(
    item.quantity *
    (hasDiscount ? item.productPriceWithDiscount! : item.productPrice)
  );

  return (
    <AppBox className="spa-cart-item" data-cy="cart-item">
      {hasDiscount && (
        <AppBadge
          className="spa-cart-item__discount-badge"
          badgeContent={`-${item.discount}%`}
          variant="danger"
          size="small"
          data-testid="cart-item-discount-badge"
        >
          <AppBox
            component="img"
            src={item.image}
            className="spa-cart-item__image"
          />
        </AppBadge>
      )}
      {!hasDiscount && (
        <AppBox
          component="img"
          src={item.image}
          className="spa-cart-item__image"
          data-testid="cart-item-img"
        />
      )}
      <AppBox className="spa-cart-item__details">
        <AppTypography
          className="spa-cart-item__title"
          variant="subtitle2"
          fontWeight="extra-bold"
        >
          {item.name}
        </AppTypography>
        <AppBox className="spa-cart-item__prices">
          {hasDiscount ? (
            <>
              <AppTypography className="spa-cart-item__price-old">
                {formatPrice(item.productPrice)}
              </AppTypography>
              <AppTypography className="spa-cart-item__price-discounted">
                {formatPrice(item.productPriceWithDiscount!)}
              </AppTypography>
            </>
          ) : (
            <AppTypography className="spa-cart-item__regular-price">
              {formatPrice(item.productPrice)}
            </AppTypography>
          )}
        </AppBox>
        {roundedPercentage > 0 && (
          <AppBox className="spa-cart-item__bestseller">
            <AppTypography
              variant="body"
              translationKey="bestsellers.title"
              translationProps={{
                values: {
                  count: roundedPercentage
                }
              }}
            />
          </AppBox>
        )}
      </AppBox>
      <AppBox className="spa-cart-item__quantity-price">
        <QuantitySelector
          initialQuantity={item.quantity}
          onQuantityChange={(newQuantity) => onQuantityChange(item, newQuantity)}
        />
        <AppBox className="spa-cart-item__price-delete-icon">
          <AppBox className="spa-cart-item__price">
            <AppTooltip titleTranslationKey={totalPrice}>
              <AppTypography
                className={
                  hasDiscount
                    ? "spa-cart-item__price-discounted-total"
                    : "spa-cart-item__price-value"
                }
              >
                {totalPrice}
              </AppTypography>
            </AppTooltip>
          </AppBox>
          <AppBox
            className="spa-cart-item__delete-block"
            onClick={handleRemoveCartItem}
            data-cy="remove-cart-item-button"
            data-testid="remove-cart-item-button"
          >
            <DeleteIcon />
          </AppBox>
        </AppBox>
      </AppBox>
    </AppBox>
  );
};

export default CartItem;
