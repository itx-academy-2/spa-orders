import { render, screen } from "@testing-library/react";
import ReservationsTable from "@/containers/tables/reservations-table/ReservationsTable";

import * as queriesModule from "@/store/tanstack-api/modules/products/queries";
import usePagination from "@/hooks/use-pagination/usePagination";
import useScreenSize from "@/utils/check-screen-size/useScreenSize";
import { ProductReservationDetails } from "@/types/product.types";

jest.mock("@/store/tanstack-api/modules/products/queries");
jest.mock("@/hooks/use-pagination/usePagination");
jest.mock("@/utils/check-screen-size/useScreenSize");

const mockPagination = { page: 1 };
const mockScreenSize = { width: 1200 };
const mockReservations: ProductReservationDetails[] = [
    { username: "John Doe", email: "john@example.com", quantity: 2, addedAt: "2025-01-05T10:00:00Z" },
];

describe("ReservationsTable", () => {
    const useGetQuery = queriesModule.useGetManagerProductReservationsQuery as jest.Mock;

    beforeEach(() => {
        (usePagination as jest.Mock).mockReturnValue(mockPagination);
        (useScreenSize as jest.Mock).mockReturnValue(mockScreenSize);
        useGetQuery.mockReturnValue({ data: { content: mockReservations } });
    });

    test("renders table rows correctly", () => {
        render(<ReservationsTable productId={"1"} />);

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("john@example.com")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    test("renders fallback when no reservations", () => {
        useGetQuery.mockReturnValue({ data: { content: [] } });

        render(<ReservationsTable productId={"1"} />);

        expect(screen.getByText("reservationsTable.fallback")).toBeInTheDocument();
    });
});
