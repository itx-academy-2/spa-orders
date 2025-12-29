import { useParams } from "react-router-dom";

import DashboardReservationsContainer from "@/pages/dashboard/dashboard-reservations/components/DashboardReservationsContainer";
import { reservationsPageNotFoundErrorConfig } from "@/pages/dashboard/dashboard-reservations/DashboardReservationsPage.constants";
import useErrorPageRedirect from "@/hooks/use-error-page-redirect/useErrorPageRedirect";

const DashboardReservationsPage = () => {
    const { productId } = useParams();

    const { renderRedirectComponent } = useErrorPageRedirect();

    if (!productId) {
        return renderRedirectComponent(reservationsPageNotFoundErrorConfig);
    }

    return (
        <>
            <DashboardReservationsContainer productId={productId} />
        </>
    )
};

export default DashboardReservationsPage
