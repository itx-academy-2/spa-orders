import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import ProductsContainer from "@/containers/products-container/ProductsContainer";

import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

import { useLocaleContext } from "@/context/i18n/I18nProvider";
import { useGetSalesProductsQuery } from "@/store/api/productsApi";

import "@/pages/sales/SalesPage.scss";

const SalesPage = () => {
  const { locale } = useLocaleContext();

  const {
    data: salesResponse,
    isLoading,
    isError
  } = useGetSalesProductsQuery({
    lang: locale
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
          loadingItemsCount={10}
          isLoading={isLoading}
          isError={isError}
        />
      </AppBox>
    </PageWrapper>
  );
};

export default SalesPage;
