import { useLocaleContext } from "@/context/i18n/I18nProvider";
import {
  useGetSuggestedProductQuery,
  useGetUserProductByIdQuery
} from "@/store/api/productsApi";
import getPreviousVisitsData from "@/utils/get-previous-visits-data/get-previous-visits-data";

const useSuggestedProduct = () => {
  const { locale } = useLocaleContext();

  const visitsData = getPreviousVisitsData();

  const productById = useGetUserProductByIdQuery(
    {
      productId: visitsData.product,
      lang: locale
    },
    { skip: !visitsData.product }
  );

  const getCategoryType = () => {
    if (!visitsData.category && !visitsData.category) return null;
    if (visitsData.lastVisitedType === "category") {
      if (
        productById.data &&
        productById.data.tags.some((item) => item.includes(visitsData.category))
      ) {
        return null;
      }
      return `category:${visitsData.category}`;
    }
    return null;
  };

  const categoryType = getCategoryType();

  const lastVisistedCategoryData = useGetSuggestedProductQuery(
    { tag: categoryType!, lang: locale },
    { skip: !categoryType }
  );

  return {
    data: categoryType ? lastVisistedCategoryData : productById,
    userHasVisitsInfo: Boolean(visitsData.category || visitsData.product)
  };
};

export default useSuggestedProduct;
