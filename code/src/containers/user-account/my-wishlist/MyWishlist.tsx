import { useSearchParams } from "react-router-dom";

import ProductsContainer from "@/containers/products-container/ProductsContainer";
import PageLoadingFallback from "@/containers/page-loading-fallback/PageLoadingFallback";
import PaginationBlock from "@/containers/pagination-block/PaginationBlock";

import AppBox from "@/components/app-box/AppBox";
import AppContainer from "@/components/app-container/AppContainer";
import AppDropdown from "@/components/app-dropdown/AppDropdown";
import AppTypography from "@/components/app-typography/AppTypography";

import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";
import { useLocaleContext } from "@/context/i18n/I18nProvider";
import { sortOptions } from "@/pages/products/ProductsPage.constants";
import usePagination from "@/hooks/use-pagination/usePagination";
import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";
import useScreenSize from "@/utils/check-screen-size/useScreenSize";

import * as styles from "@/containers/user-account/my-wishlist/MyWishlist.module.scss";

const MyWishlist = () => {
  const { locale } = useLocaleContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page } = usePagination();
  const screenSize = useScreenSize();
  const size = Math.min(setProductsPerPageSize(screenSize.width), 6);

  const sortOption = searchParams.get("sort");

  const {
    data: wishlist,
    isLoading,
  } = useGetUserWishlistQuery({
    page: page - 1,
    size,
    sort: sortOption ?? undefined,
    lang: locale
  });

  const productsList = wishlist?.content ?? [];

  const isEmpty = !isLoading && productsList.length === 0;

  const productsCount = wishlist?.totalElements ?? 0;

  const defaultDropdownText = sortOptions.find(
    (item) => item.value === sortOption
  )?.label || <AppTypography translationKey="productsDefault.label" />;

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    
    setSearchParams(params);
  };

  if (isLoading) {
    return <PageLoadingFallback />;
  }

  return (
    <AppContainer className={styles.MyWishlist} data-cy="my-wishlist">
      <AppTypography
        variant="h3"
        translationKey="myWishlist.title"
      />
      <AppBox className={styles.MyWishlist_info}>
        <AppTypography className={styles.MyWishlist_count} component="span">
          <AppTypography
            translationKey="myWishlist.productsCount"
            component="span"
            translationProps={{ values: { count: productsCount } }}
          />
        </AppTypography>
        <AppDropdown
          key={sortOption}
          options={sortOptions}
          onSelect={handleSortChange}
          defaultLabel={defaultDropdownText}
          className={styles.MyWishlist_sort}
          data-cy="my-wishlist-dropdown"
          data-testid="my-wishlist-dropdown"
        />
      </AppBox>
      {isEmpty && (
        <AppTypography
          className={styles.MyWishlist_emptyMessage}
          translationKey="myWishlist.emptyMessage"
          variant="body"
        />
      )}
      <ProductsContainer
        className={styles.MyWishlist_productsGrid}
        products={productsList ?? []}
        isLoading={isLoading}
        loadingItemsCount={10}
        wishlist={productsList ?? []}
      />
      <PaginationBlock
        page={page}
        totalPages={wishlist?.totalPages}
      />
    </AppContainer>
  );
};

export default MyWishlist;
