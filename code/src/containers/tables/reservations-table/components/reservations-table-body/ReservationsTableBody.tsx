import { AppTableCell } from "@/components/app-table/components";
import CircularCountdown from "@/components/circular-countdown/CircularCountdown";

import { ReservationsTableBodyProps } from "@/containers/tables/reservations-table/components/reservations-table-body/ReservationsTableBody.types";
import { useTimeLeft } from "@/containers/tables/reservations-table/hooks/useTimeLeft";

import { formatTimeLeft } from "@/utils/calculate-time-left/calculateTimeLeft";
import { FormattedDate } from "react-intl";

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
            <AppTableCell>
                <FormattedDate
                    value={new Date(addedAt + "Z")}
                    year="numeric"
                    month="2-digit"
                    day="2-digit"
                    hour="2-digit"
                    minute="2-digit"
                    second="2-digit"
                    hour12={false}
                    timeZone="Europe/Kyiv"
                />
            </AppTableCell>
            <AppTableCell>
                <CircularCountdown reservedAt={addedAt} size={50} />
            </AppTableCell>
        </>
    );
};

export default ReservationsTableBody;