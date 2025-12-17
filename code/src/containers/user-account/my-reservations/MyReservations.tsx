import AppBox from "@/components/app-box/AppBox";
import AppContainer from "@/components/app-container/AppContainer";
import AppTypography from "@/components/app-typography/AppTypography";

import { useGetMyReservationsQuery } from "@/store/tanstack-api/modules/reservations";
import { useLocaleContext } from "@/context/i18n/I18nProvider";
import usePagination from "@/hooks/use-pagination/usePagination";
import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";
import useScreenSize from "@/utils/check-screen-size/useScreenSize";

import * as styles from "@/containers/user-account/my-reservations/MyReservations.module.scss";
import ProductsContainer from "@/containers/products-container/ProductsContainer";
import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";
import PaginationBlock from "@/containers/pagination-block/PaginationBlock";
import PageLoadingFallback from "@/containers/page-loading-fallback/PageLoadingFallback";

const MyReservations = () => {
    const { locale } = useLocaleContext();
    const { page } = usePagination();
    const screenSize = useScreenSize();
    const size = Math.min(setProductsPerPageSize(screenSize.width), 6);

    const { data: reservations, isLoading } = useGetMyReservationsQuery({
        page: page - 1,
        size,
        lang: locale
    });

    const productsList = reservations ?? [];
    const productsCount = productsList.length;
    const isEmpty = !isLoading && productsList.length === 0;

    const { data: wishlistData } = useGetUserWishlistQuery();
    const wishlist = wishlistData?.content ?? [];

    if (isLoading) {
        return <PageLoadingFallback />;
    }

    return (
        <AppContainer className={styles.MyReservations}>
            <AppBox className={styles.MyReservations_header}>
                <AppTypography variant="h3" translationKey="MyReservations.title" />
            </AppBox>
            <AppBox className={styles.MyReservations_info}>
                <AppTypography className={styles.MyReservations_count} component="span">
                    <AppTypography
                        translationKey="MyReservations.productsCount"
                        component="span"
                        translationProps={{ values: { count: productsCount } }}
                    />
                </AppTypography>
            </AppBox>
            {isEmpty && (
                <AppTypography
                    className={styles.MyReservations_emptyMessage}
                    translationKey="MyReservations.emptyMessage"
                    variant="body"
                />
            )}
            <ProductsContainer
                className={styles.MyReservations_productsGrid}
                products={productsList ?? []}
                isLoading={isLoading}
                loadingItemsCount={10}
                wishlist={wishlist}
                maxColumns={3}
            />
            <PaginationBlock page={page} />
        </AppContainer>
    );
};

export default MyReservations;