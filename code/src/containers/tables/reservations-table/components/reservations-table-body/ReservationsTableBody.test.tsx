import { render, screen } from "@testing-library/react";

import ReservationsTableBody from "@/containers/tables/reservations-table/components/reservations-table-body/ReservationsTableBody";

jest.mock("@/containers/tables/reservations-table/hooks/useTimeLeft", () => ({
    useTimeLeft: jest.fn(),
}));

jest.mock("@/utils/calculate-time-left/calculateTimeLeft", () => ({
    formatTimeLeft: jest.fn(),
}));

jest.mock("@/utils/format-date/formatDate", () => jest.fn());

import { useTimeLeft } from "@/containers/tables/reservations-table/hooks/useTimeLeft";
import { formatTimeLeft } from "@/utils/calculate-time-left/calculateTimeLeft";
import formatDate from "@/utils/format-date/formatDate";

const mockReservation = {
    username: "John Doe",
    email: "john@example.com",
    quantity: 3,
    addedAt: "2025-01-01T12:00:00Z",
};

describe("ReservationsTableBody", () => {
    const renderInTable = (reservation = mockReservation) =>
        render(
            <table>
                <tbody>
                    <tr>
                        <ReservationsTableBody reservation={reservation} />
                    </tr>
                </tbody>
            </table>
        );

    test("renders username, email and quantity", () => {
        (useTimeLeft as jest.Mock).mockReturnValue({ expired: false });
        (formatTimeLeft as jest.Mock).mockReturnValue("10:00");
        (formatDate as jest.Mock).mockReturnValue("01.01.2025");

        renderInTable();

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("john@example.com")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
    });

    test("renders timeLeft as plain text when not expired", () => {
        (useTimeLeft as jest.Mock).mockReturnValue({ expired: false });
        (formatTimeLeft as jest.Mock).mockReturnValue("09:30");

        renderInTable();

        expect(screen.getByText("09:30")).toBeInTheDocument();
    });

    test("renders AppTypography when timeLeft is expired", () => {
        (useTimeLeft as jest.Mock).mockReturnValue({ expired: true });
        (formatTimeLeft as jest.Mock).mockReturnValue("expired");

        renderInTable();

        expect(screen.getByText("expired")).toBeInTheDocument();
    });

    test("renders formatted date", () => {
        (useTimeLeft as jest.Mock).mockReturnValue({ expired: false });
        (formatTimeLeft as jest.Mock).mockReturnValue("10:00");
        (formatDate as jest.Mock).mockReturnValue("12.12.2024");

        renderInTable();

        expect(screen.getByText("12.12.2024")).toBeInTheDocument();
    });
});
