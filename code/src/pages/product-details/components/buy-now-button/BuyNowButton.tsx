import AppButton from "@/components/app-button/AppButton";
import AppTypography from "@/components/app-typography/AppTypography";

import useAddToCartOrOpenDrawer from "@/hooks/use-add-to-cart-or-open-drawer/useAddToCartOrOpenDrawer";
import { Product } from "@/types/product.types";

type BuyNowButtonProps = {
  productWithId: Omit<Product, "status">;
  disabled?: boolean;
};

const BuyNowButton = ({ productWithId, disabled = false }: BuyNowButtonProps) => {
  const {
    isProductInCart,
    addToCartOrOpenDrawer,
    isCartLoading,
    isAddingToCart
  } = useAddToCartOrOpenDrawer(productWithId);

  let translationKey: string;

  if (isAddingToCart) {
    translationKey = "productDetailsPage.addingToCartButton";
  } else if (isProductInCart) {
    translationKey = "productDetailsPage.buyNowButton";
  } else {
    translationKey = "productDetailsPage.addToCartButton";
  }

  const isButtonLoading = isAddingToCart || isCartLoading;

  return (
    <AppButton
      onClick={addToCartOrOpenDrawer}
      disabled={disabled || isButtonLoading}
      isLoading={isButtonLoading}
    >
      <AppTypography translationKey={translationKey} />
    </AppButton>
  );
};

export default BuyNowButton;
