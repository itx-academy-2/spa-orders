import { useState, useEffect } from "react";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import AppBadge from "@/components/app-badge/AppBadge";
import AppBox from "@/components/app-box/AppBox";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppTypography from "@/components/app-typography/AppTypography";
import QuantitySelector from "@/components/quantity-selector/QuantitySelector";

import { CartDrawerItemProps } from "@/types/cart.types";
import formatPrice from "@/utils/format-price/formatPrice";

import "@/containers/cart-drawer/cart-drawer-item/CartDrawerItem.scss";

const CartDrawerItem = ({
  onRemove = () => { },
  onQuantityChange,
  ...props
}: CartDrawerItemProps) => {
  const [quantity, setQuantity] = useState(props.quantity);

  const hasDiscount = props.discount && props.discount > 0;
  const ordersPercentage = props.percentageOfTotalOrders;
  const roundedPercentage = Math.round(ordersPercentage || 0);

  const totalPrice = formatPrice(
    quantity * (hasDiscount ? props.productPriceWithDiscount! : props.productPrice)
  );

  const handleRemoveItem = () => {
    onRemove(props);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange({ ...props, quantity: newQuantity }, newQuantity);
    }
  };

  useEffect(() => {
    setQuantity(props.quantity);
  }, [props.quantity]);

  return (
    <AppBox className="cart-item">
      {hasDiscount ? (
        <AppBadge
          className="cart-item__discount-badge"
          data-testid="cart-item-discount-badge"
          badgeContent={
            <AppTypography variant="caption-small">
              {`-${props.discount}%`}
            </AppTypography>
          }
          variant="danger"
          size="small"
        />
      ) : null}
      <AppBox
        component="img"
        alt={props.name}
        src={props.image}
        className="cart-item__img"
      />
      <AppBox className="cart-item__content">
        <AppBox className="cart-item__title-price-label-container">
          <AppTypography className="cart-item__title">{props.name}</AppTypography>
          <Box className="cart-item__price-container">
            {hasDiscount ? (
              <>
                <AppTypography
                  className="cart-item__price cart-item__price-old"
                  variant="body"
                >
                  {formatPrice(props.productPrice)}
                </AppTypography>
                <AppTypography
                  className="cart-item__price cart-item__price-discounted"
                  variant="concept"
                  data-testid="cart-item-discounted-price"
                >
                  {formatPrice(props.productPriceWithDiscount!)}
                </AppTypography>
              </>
            ) : (
              <AppTypography className="cart-item__price" variant="concept">
                {formatPrice(props.productPrice)}
              </AppTypography>
            )}
          </Box>
          {roundedPercentage > 0 && (
            <AppBox className="cart-item__bestseller-box">
              <AppTypography
                style={{ fontSize: "12px" }}
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
        <AppBox className="cart-item__quantity-selector-total-price-container">
          <AppBox className="cart-item__quantity-selector cart-item__quantity-selector--small">
            <QuantitySelector initialQuantity={quantity} onQuantityChange={handleQuantityChange} />
          </AppBox>
            <AppTypography
              className="cart-item__item-total-price"
              variant="concept"
            >
              {totalPrice}
            </AppTypography>
        </AppBox>

        <AppBox className="cart-item__price-delete-icon">
          <AppIconButton
            color="default"
            className="cart-item__remove-button"
            data-testid="remove-item-from-cart-button"
            onClick={handleRemoveItem}
          >
            <CloseIcon />
          </AppIconButton>
        </AppBox>
      </AppBox>
    </AppBox>
  );
};

export default CartDrawerItem;
