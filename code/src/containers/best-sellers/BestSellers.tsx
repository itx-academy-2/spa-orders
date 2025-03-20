import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import BestSellerContainer from "@/containers/best-sellers/components/bestseller-container/BestSellerContainer";

import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppTypography from "@/components/app-typography/AppTypography";

import routes from "@/constants/routes";
import { useLocaleContext } from "@/context/i18n/I18nProvider";
import { useGetBestsellerProductsQuery } from "@/store/api/productsApi";

import "@/containers/best-sellers/BestSellers.scss";

const BestSellers = () => {
  const { locale } = useLocaleContext();
  const {
    data: bestsellersData,
    isLoading,
    isError
  } = useGetBestsellerProductsQuery({
    page: 0,
    size: 5,
    lang: locale,
    tags: ""
  });

  return (
    <PageWrapper
      id="bestsellers-section"
      className="spa-best-sellers"
      data-cy="best-sellers"
    >
      <AppTypography
        className="spa-best-sellers__header"
        translationKey="bestSellers.header"
        variant="h3"
      />
      <BestSellerContainer
        isLoading={isLoading}
        isError={isError}
        products={bestsellersData?.content ?? []}
      />
      <AppBox className="spa-best-sellers__button">
        <AppButton
          to={routes.products.path}
          size="extra-large"
          data-cy="best-sellers-button"
        >
          <AppTypography translationKey="bestSellers.button" />
        </AppButton>
      </AppBox>
    </PageWrapper>
  );
};

export default BestSellers;
