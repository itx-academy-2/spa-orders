import { render, screen } from "@testing-library/react";
import ReservationsTableHead from "@/containers/tables/reservations-table/components/reservations-table-head/ReservationsTableHead";

describe("ReservationsTableHead", () => {
    test("Should be rendered correctly", () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <ReservationsTableHead head="head" />
                    </tr>
                </tbody>
            </table>
        );

        const headElement = screen.getByText("head");
        expect(headElement).toBeInTheDocument();
    });
});
