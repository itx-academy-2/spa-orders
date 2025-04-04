import { ProductsContainerProps } from "@/containers/products-container/ProductsContainer.types";

import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";
import BestSellerCard from "@/components/bestseller-card/BestSellerCard";
import SaleProductCard from "@/components/product-sale-card/SaleProductCard";
import ProductSkeleton from "@/components/product-skeleton/ProductSkeleton";

import useGetCart from "@/hooks/use-get-cart/useGetCart";
import { useIsAuthLoadingSelector } from "@/store/slices/userSlice";
import { Product } from "@/types/product.types";
import cn from "@/utils/cn/cn";
import repeatComponent from "@/utils/repeat-component/repeatComponent";

import "@/containers/best-sellers/components/bestseller-container/BestSellerContainer.scss";

const BestSellerContainer = ({
  products,
  className,
  isLoading = false,
  isError = false,
  loadingItemsCount = 5,
  maxColumns = 5,
  errorMessage = "errors.somethingWentWrong"
}: ProductsContainerProps) => {
  const { isLoading: isCartLoading } = useGetCart();
  const isAuthLoading = useIsAuthLoadingSelector();

  if (isError) {
    return (
      <AppBox
        className={cn("products-container_error", className)}
        data-cy="products-error"
      >
        <AppTypography
          translationKey={errorMessage}
          className="products-container__error-label"
          data-cy="products-error-label"
        />
      </AppBox>
    );
  }

  const productCards = products.map((product: Product) =>
    product.priceWithDiscount && product.discount ? (
      <SaleProductCard key={product.id} product={product} />
    ) : (
      <BestSellerCard key={product.id} product={product} />
    )
  );

  const skeletonCards = repeatComponent(<ProductSkeleton />, loadingItemsCount);

  const isLoadingInProgress = isLoading || isAuthLoading || isCartLoading;

  const gridItems = isLoadingInProgress ? skeletonCards : productCards;

  return (
    <AppBox
      className={cn(
        "products-container",
        `products-container__${maxColumns}-cols`,
        className
      )}
      data-testid="products-container"
      data-cy="products-container"
    >
      {gridItems}
    </AppBox>
  );
};

export default BestSellerContainer;
