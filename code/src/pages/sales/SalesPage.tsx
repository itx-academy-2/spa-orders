import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import PaginationBlock from "@/containers/pagination-block/PaginationBlock";
import ProductsContainer from "@/containers/products-container/ProductsContainer";

import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

import { useLocaleContext } from "@/context/i18n/I18nProvider";
import usePagination from "@/hooks/use-pagination/usePagination";
import { useGetSalesProductsQuery } from "@/store/api/productsApi";

import "@/pages/sales/SalesPage.scss";

const SalesPage = () => {
  const { locale } = useLocaleContext();

  const { page } = usePagination();

  const {
    data: salesResponse,
    isLoading,
    isError
  } = useGetSalesProductsQuery({
    lang: locale,
    size: 3,
    page: page - 1
  });

  const salesList = salesResponse?.content;
  const salesCount = salesResponse?.totalElements ?? 0;

  return (
    <PageWrapper>
      <AppBox className="spa-sales-page" data-cy="sales-page">
        <AppTypography
          variant="h3"
          className="spa-sales-page__header"
          translationKey="productsAll.sales"
          component="h1"
        />
        <AppBox className="spa-sales-page__info">
          <AppTypography className="spa-sales-page__count" component="span">
            <AppTypography
              translationKey="salesPage.label"
              component="span"
              translationProps={{ values: { count: salesCount } }}
            />
          </AppTypography>
        </AppBox>
        <ProductsContainer
          className="spa-sales-page__grid"
          products={salesList ?? []}
          loadingItemsCount={3}
          isLoading={isLoading}
          isError={isError}
          maxColumns={3}
        />
        <PaginationBlock page={page} totalPages={salesResponse?.totalPages} />
      </AppBox>
    </PageWrapper>
  );
};

export default SalesPage;
