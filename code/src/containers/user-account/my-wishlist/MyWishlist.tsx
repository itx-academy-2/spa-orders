import ProductsContainer from "@/containers/products-container/ProductsContainer";
import PageLoadingFallback from "@/containers/page-loading-fallback/PageLoadingFallback";

import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

import { useGetWishlistQuery } from "@/store/api/wishlistApi";

import "@/containers/user-account/my-wishlist/MyWishlist.scss";

const MyWishlist = () => {
  const { data: wishlist = [], isLoading } = useGetWishlistQuery();
  const isEmpty = !isLoading && wishlist.length === 0;

  if (isLoading) {
    return <PageLoadingFallback />;
  }

  return (
    <AppBox className="spa-my-wishlist" data-cy="my-wishlist">
      <AppTypography
        variant="h3"
        className="spa-my-wishlist__title"
        translationKey="myWishlist.title"
      />

      {isEmpty && (
        <AppTypography
          className="spa-my-wishlist__empty-message"
          translationKey="myWishlist.emptyMessage"
          variant="body"
        />
      )}

      <ProductsContainer
        className="spa-my-wishlist__grid"
        products={wishlist}
        isLoading={isLoading}
        loadingItemsCount={10}
      />
    </AppBox>
  );
};

export default MyWishlist;
