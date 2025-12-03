import { AppTableCell } from "@/components/app-table/components";
import AppTypography from "@/components/app-typography/AppTypography";

import { ReservationsTableHeadProps } from "@/containers/tables/reservations-table/components/reservations-table-head/ReservationsTableHead.types"

import "@/containers/tables/reservations-table/components/reservations-table-head/ReservationsTableHead.scss"

const ReservationsTableHead = ({ head }: ReservationsTableHeadProps) => {
    return (
        <AppTableCell className="reservations-table__head">
            <AppTypography translationKey={head} variant="caption" />
        </AppTableCell>
    );
};

export default ReservationsTableHead;
