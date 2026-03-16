import { AppTableCell } from "@/components/app-table/components";

import { ReservationsTableBodyProps } from "@/containers/tables/reservations-table/components/reservations-table-body/ReservationsTableBody.types";
import { useTimeLeft } from "@/containers/tables/reservations-table/hooks/useTimeLeft";

import { formatTimeLeft } from "@/utils/calculate-time-left/calculateTimeLeft";
import formatDate from "@/utils/format-date/formatDate";

const ReservationsTableBody = ({ reservation }: ReservationsTableBodyProps) => {
    const {
        username,
        email,
        quantity,
        addedAt
    } = reservation;

    const duration = useTimeLeft(addedAt);
    const formattedTime = formatTimeLeft(duration);

    return (
        <>
            <AppTableCell>{username}</AppTableCell>
            <AppTableCell>{email}</AppTableCell>
            <AppTableCell>{quantity}</AppTableCell>
            <AppTableCell>{formattedTime}</AppTableCell>
            <AppTableCell>{formatDate(addedAt)}</AppTableCell>
        </>
    );
};

export default ReservationsTableBody;