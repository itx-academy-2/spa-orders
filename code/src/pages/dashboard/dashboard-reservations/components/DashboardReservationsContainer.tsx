import ReservationsTable from "@/containers/tables/reservations-table/ReservationsTable";
import ReservedProductDetails from "@/components/reserved-product-details/ReservedProductDetails";

import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";
import useScreenSize from "@/utils/check-screen-size/useScreenSize";
import usePagination from "@/hooks/use-pagination/usePagination";
import { reservationsPageNotFoundErrorConfig } from "@/pages/dashboard/dashboard-reservations/DashboardReservationsPage.constants";
import useErrorPageRedirect from "@/hooks/use-error-page-redirect/useErrorPageRedirect";
import { DashboardReservationsContainerProps } from "@/pages/dashboard/dashboard-reservations/components/DashboardReservationsContainer.types";
import AppContainer from "@/components/app-container/AppContainer";

import "@/pages/dashboard/dashboard-reservations/components/DashboardReservationsContainer.scss"
import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

const DashboardReservationsContainer = ({
    productId
}: DashboardReservationsContainerProps) => {
    const { renderRedirectComponent } = useErrorPageRedirect();

    if (!productId) {
        return renderRedirectComponent(reservationsPageNotFoundErrorConfig);
    }

    return (
        <AppContainer className="dashboard-reservations">
            <AppBox className="dashboard-reservations__header">
                <AppTypography variant="h3" translationKey="reservations.title" />
            </AppBox>
            <ReservedProductDetails productId={productId} />
            <ReservationsTable productId={productId} />
        </AppContainer>
    )
};

export default DashboardReservationsContainer