import { useSearchParams } from "react-router-dom";

import ProductsContainer from "@/containers/products-container/ProductsContainer";
import PageLoadingFallback from "@/containers/page-loading-fallback/PageLoadingFallback";

import AppBox from "@/components/app-box/AppBox";
import AppDropdown from "@/components/app-dropdown/AppDropdown";
import AppTypography from "@/components/app-typography/AppTypography";

import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";
import { useLocaleContext } from "@/context/i18n/I18nProvider";
import { sortOptions } from "@/pages/products/ProductsPage.constants";

import "@/containers/user-account/my-wishlist/MyWishlist.scss";


const MyWishlist = () => {
  const { locale } = useLocaleContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const sortOption = searchParams.get("sort");

  const {
    data: wishlist,
    isLoading,
  } = useGetUserWishlistQuery({
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
    <AppBox className="spa-my-wishlist" data-cy="my-wishlist">
      <AppTypography
        variant="h3"
        className="spa-my-wishlist__title"
        translationKey="myWishlist.title"
      />
      <AppBox className="spa-my-wishlist__info">
        <AppTypography className="spa-my-wishlist__count" component="span">
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
          className="spa-my-wishlist__sort"
          data-cy="my-wishlist-dropdown"
          data-testid="my-wishlist-dropdown"
        />
      </AppBox>
      {isEmpty && (
        <AppTypography
          className="spa-my-wishlist__empty-message"
          translationKey="myWishlist.emptyMessage"
          variant="body"
        />
      )}
      <ProductsContainer
        className="spa-my-wishlist__grid"
        products={productsList ?? []}
        isLoading={isLoading}
        loadingItemsCount={10}
      />
    </AppBox>
  );
};

export default MyWishlist;
