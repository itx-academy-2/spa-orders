import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";
import AppContainer from "@/components/app-container/AppContainer";
import ReservedProductDetails from "@/components/reserved-product-details/ReservedProductDetails";

import ReservationsTable from "@/containers/tables/reservations-table/ReservationsTable";
import PageLoadingFallback from "@/containers/page-loading-fallback/PageLoadingFallback";

import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";
import useScreenSize from "@/utils/check-screen-size/useScreenSize";
import usePagination from "@/hooks/use-pagination/usePagination";
import useErrorPageRedirect from "@/hooks/use-error-page-redirect/useErrorPageRedirect";

import { DashboardReservationsContainerProps } from "@/pages/dashboard/dashboard-reservations/components/DashboardReservationsContainer.types";
import { reservationsPageNotFoundErrorConfig } from "@/pages/dashboard/dashboard-reservations/DashboardReservationsPage.constants";

import { useGetManagerProductQuery } from "@/store/api/productsApi";
import { useGetManagerProductReservationsQuery } from "@/store/tanstack-api/modules/products";

import "@/pages/dashboard/dashboard-reservations/components/DashboardReservationsContainer.scss"

const DashboardReservationsContainer = ({
    productId
}: DashboardReservationsContainerProps) => {
    const { renderRedirectComponent } = useErrorPageRedirect();
    const { page } = usePagination();
    const screenSize = useScreenSize();
    const size = Math.min(setProductsPerPageSize(screenSize.width), 3);

    const {
        data: product,
        isLoading: isLoadingProduct,
        error: productError
    } = useGetManagerProductQuery({ productId });

    const { data: reservations,
        isLoading: isLoadingReservations,
        error: reservationsError
    } = useGetManagerProductReservationsQuery({
        productId,
        page: page - 1,
        size: size,
    });

    if (!productId) return renderRedirectComponent(reservationsPageNotFoundErrorConfig);

    if (isLoadingProduct) return <PageLoadingFallback />;
    if (productError) return <AppTypography translationKey="errors.somethingWentWrong" />;

    if (!product) return <AppTypography translationKey="errors.notFound" />;

    if (isLoadingReservations) return <PageLoadingFallback />;
    if (reservationsError) return <AppTypography translationKey="errors.somethingWentWrong" />;

    const reservationsContent = reservations?.content ?? [];

    return (
        <AppContainer className="dashboard-reservations">
            <AppBox className="dashboard-reservations__header">
                <AppTypography variant="h3" translationKey="reservations.title" />
            </AppBox>
            <ReservedProductDetails product={product} />
            <ReservationsTable reservations={reservationsContent} />
        </AppContainer>
    )
};

export default DashboardReservationsContainer