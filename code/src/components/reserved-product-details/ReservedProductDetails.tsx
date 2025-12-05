import { useIntl } from "react-intl";

import AppBox from "@/components/app-box/AppBox";
import AppContainer from "@/components/app-container/AppContainer";
import AppTypography from "@/components/app-typography/AppTypography";
import DetailItem from "@/components/detail-item/DetailItem";

import { useLocaleContext } from "@/context/i18n/I18nProvider";
import { ReservedProductDetailsProps } from "@/components/reserved-product-details/ReservedProductDetails.types";
import getCategoryFromTags from "@/utils/get-category-from-tags/getCategoryFromTags";

import "@/components/reserved-product-details/ReservedProductDetails.scss";

const ReservedProductDetails = ({ product }: ReservedProductDetailsProps) => {
    const { locale } = useLocaleContext();
    const { formatMessage } = useIntl();

    if (!product) {
        return <AppTypography translationKey="errors.notFound" />;
    }

    const translations = product.productTranslations;

    const productName =
        translations.find(t => t.languageCode === locale)?.name ??
        translations[0]?.name ??
        "-";

    const categoryName = getCategoryFromTags(product.tags.map(tag => tag.name));

    const category = categoryName ? formatMessage({ id: `productsAll.${categoryName}` }) : "-";

    return (
        <AppContainer className="reserved-product-details">
            <AppBox className="reserved-product-details__image-section">
                <img src={product.image} alt={productName} />
            </AppBox>
            <AppBox className="reserved-product-details__info-section">
                <DetailItem labelTranslationKey="reservedProductDetails.productName.label" value={productName} />
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
