import AppBox from "@/components/app-box/AppBox";
import AppContainer from "@/components/app-container/AppContainer";
import AppTypography from "@/components/app-typography/AppTypography";
import DetailItem from "@/components/detail-item/DetailItem";

import PageLoadingFallback from "@/containers/page-loading-fallback/PageLoadingFallback";
import { useLocaleContext } from "@/context/i18n/I18nProvider";
import { ReservedProductDetailsProps } from "@/pages/reservations-details/components/reserved-product-details/ReservedProductDetails.types";
import { useGetUserProductByIdQuery } from "@/store/api/productsApi";
import getCategoryFromTags from "@/utils/get-category-from-tags/getCategoryFromTags";

import "@/pages/reservations-details/components/reserved-product-details/ReservedProductDetails.scss";

const ReservedProductDetails = ({
    productId
}: ReservedProductDetailsProps) => {
    const { locale } = useLocaleContext();

    const {
        data: product,
        isLoading,
        error
    } = useGetUserProductByIdQuery({
        productId,
        lang: locale
    });

    if (isLoading) {
        return <PageLoadingFallback />;
    }

    if (!product || error) {
        return <AppTypography translationKey="errors.somethingWentWrong" />;
    }

    const categoryName = getCategoryFromTags(product.tags);

    const category = categoryName ? (
        <AppTypography translationKey={`productsAll.${categoryName}`} variant="caption" />
    ) : (
        <AppTypography variant="caption">-</AppTypography>
    );

    return (
        <AppContainer className="reserved-product-details">
            <AppBox className="reserved-product-details__image-section">
                <img src={product.image} alt={product.name} />
            </AppBox>
            <AppBox className="reserved-product-details__info-section">
                <DetailItem labelTranslationKey="reservedProductDetails.productName.label" value={product.name} />
                <DetailItem labelTranslationKey="reservedProductDetails.productCategory.label" value={category} />
                <DetailItem labelTranslationKey="reservedProductDetails.productQuantity.label" value={product.quantity} />
                <DetailItem labelTranslationKey="reservedProductDetails.productPrice.label" value={product.price} />
                <DetailItem labelTranslationKey="reservedProductDetails.productPriceWithDiscount.label" value={product.priceWithDiscount ?? "-"} />
                <DetailItem labelTranslationKey="reservedProductDetails.productDiscount.label" value={product.discount ? `${product.discount}%` : "-"} />
            </AppBox>
        </AppContainer>
    );
};

export default ReservedProductDetails;
