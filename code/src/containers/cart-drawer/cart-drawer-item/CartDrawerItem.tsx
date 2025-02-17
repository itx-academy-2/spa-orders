import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";

import AppBadge from "@/components/app-badge/AppBadge";
import AppBox from "@/components/app-box/AppBox";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppTypography from "@/components/app-typography/AppTypography";

import { CartDrawerItemProps } from "@/types/cart.types";
import formatPrice from "@/utils/format-price/formatPrice";

import "@/containers/cart-drawer/cart-drawer-item/CartDrawerItem.scss";

const CartDrawerItem = ({
  onRemove = () => {},
  ...props
}: CartDrawerItemProps) => {
  const handleRemove = () => {
    onRemove(props);
  };

  const hasDiscount = props.discount && props.discount > 0;

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
        <AppTypography className="cart-item__title">{props.name}</AppTypography>
        <Box className="cart-item__price-container">
          {hasDiscount ? (
            <>
              <AppTypography
                className="cart-item__price cart-item__price-old"
                variant="body"
              >
                {formatPrice(props.calculatedPrice)}
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
              {formatPrice(props.calculatedPrice)}
            </AppTypography>
          )}
        </Box>
      </AppBox>
      <AppIconButton
        color="default"
        className="cart-item__remove-button"
        data-testid="remove-item-from-cart-button"
        onClick={handleRemove}
      >
        <CloseIcon />
      </AppIconButton>
    </AppBox>
  );
};

export default CartDrawerItem;
