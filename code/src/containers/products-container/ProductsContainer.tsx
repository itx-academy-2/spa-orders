import { ProductsContainerProps } from "@/containers/products-container/ProductsContainer.types";

import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";
import ProductCardWithDelete from "@/components/product-card-with-delete/ProductCardWithDelete";
import ProductCard from "@/components/product-card/ProductCard";
import SaleProductCard from "@/components/product-sale-card/SaleProductCard";
import ProductSkeleton from "@/components/product-skeleton/ProductSkeleton";

import useGetCart from "@/hooks/use-get-cart/useGetCart";
import { useIsAuthLoadingSelector } from "@/store/slices/userSlice";
import { Product } from "@/types/product.types";
import cn from "@/utils/cn/cn";
import repeatComponent from "@/utils/repeat-component/repeatComponent";

import "@/containers/products-container/ProductsContainer.scss";

const ProductsContainer = ({
  products,
  className,
  isLoading = false,
  isError = false,
  loadingItemsCount = 5,
  maxColumns = 5,
  errorMessage = "errors.somethingWentWrong",
  isViewHistory = false,
  wishlist = [],
  reservationsMetadata,
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

  const productCards = products.map((product: Product) => {
    const reservation = reservationsMetadata?.find(
      r => r.id === product.id
    );

    const productCard =
      product.priceWithDiscount && product.discount ? (
        <SaleProductCard
          key={product.id}
          product={product}
          isViewHistory={isViewHistory}
          wishlist={wishlist}
          reservedAt={reservation?.reservedAt}
        />
      ) : (
        <ProductCard
          key={product.id}
          product={product}
          isViewHistory={isViewHistory}
          wishlist={wishlist}
          reservedAt={reservation?.reservedAt}
        />
      );

    return isViewHistory ? (
      <ProductCardWithDelete productId={product.id} key={product.id}>
        {productCard}
      </ProductCardWithDelete>
    ) : (
      productCard
    );
  });

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

export default ProductsContainer;
