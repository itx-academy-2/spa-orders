import { render, screen } from "@testing-library/react";
import ReservationsTable from "@/containers/tables/reservations-table/ReservationsTable";
import { ProductReservationDetails } from "@/types/product.types";

describe("ReservationsTable", () => {
  const mockReservations: ProductReservationDetails[] = [
    { username: "John Doe", email: "john@example.com", quantity: 2, addedAt: "2025-01-05T10:00:00Z" },
  ];

  test("renders table rows correctly", () => {
    render(<ReservationsTable reservations={mockReservations} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("renders fallback when no reservations", () => {
    render(<ReservationsTable reservations={[]} />);

    expect(screen.getByText("reservationsTable.fallback")).toBeInTheDocument();
  });

  test("renders fallback when reservations is undefined", () => {
    render(<ReservationsTable reservations={undefined} />);

    expect(screen.getByText("reservationsTable.fallback")).toBeInTheDocument();
  });
});
