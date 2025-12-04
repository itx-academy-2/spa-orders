
import { useState, useEffect } from "react";

import { AppTableCell } from "@/components/app-table/components";
import AppTypography from "@/components/app-typography/AppTypography";

import { ReservationsTableBodyProps } from "@/containers/tables/reservations-table/components/reservations-table-body/ReservationsTableBody.types";
import { useTimeLeft } from "@/containers/tables/reservations-table/hooks/useTimeLeft";

import { calculateTimeLeft, formatTimeLeft } from "@/utils/calculate-time-left/calculateTimeLeft";
import formatDate from "@/utils/format-date/formatDate";

const ReservationsTableBody = ({ reservation }: ReservationsTableBodyProps) => {
    const {
        username,
        email,
        quantity,
        addedAt
    } = reservation;

    const timeLeft = useTimeLeft(addedAt);

    return (
        <>
            <AppTableCell>{username}</AppTableCell>
            <AppTableCell>{email}</AppTableCell>
            <AppTableCell>{quantity}</AppTableCell>
            <AppTableCell>
                {timeLeft.expired ? (
                    <AppTypography translationKey={formatTimeLeft(timeLeft)} variant="caption" />
                ) : (
                    formatTimeLeft(timeLeft)
                )}
            </AppTableCell>
            <AppTableCell>{formatDate(addedAt)}</AppTableCell>
        </>
    );
};

export default ReservationsTableBody;
