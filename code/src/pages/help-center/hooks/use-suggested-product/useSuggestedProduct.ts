import { useLocaleContext } from "@/context/i18n/I18nProvider";
import {
  useGetSuggestedProductQuery,
  useGetUserProductByIdQuery
} from "@/store/api/productsApi";
import getPreviousVisitsData from "@/utils/get-previous-visits-data/get-previous-visits-data";

const useSuggestedProduct = () => {
  const { locale } = useLocaleContext();

  const visitsData = getPreviousVisitsData();

  const productById = useGetUserProductByIdQuery({
    productId: visitsData.product,
    lang: locale
  });

  const getCategoryType = () => {
    if (!productById.data) return null;
    if (visitsData.lastVisitedType === "category") {
      if (
        productById.data.tags.some((item) => item.includes(visitsData.category))
      ) {
        return null;
      }
      return visitsData.category;
    }
    return null;
  };

  const categoryType = getCategoryType();

  const lastVisistedCategoryData = useGetSuggestedProductQuery(
    { tag: categoryType!, lang: locale },
    { skip: !productById.data || !categoryType }
  );

  return categoryType ? lastVisistedCategoryData : productById;
};

export default useSuggestedProduct;
