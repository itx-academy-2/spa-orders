import { render, screen } from "@testing-library/react";

import DashboardReservationsContainer from "@/pages/dashboard/dashboard-reservations/components/DashboardReservationsContainer";

import useScreenSize from "@/utils/check-screen-size/useScreenSize";
import usePagination from "@/hooks/use-pagination/usePagination";
import useErrorPageRedirect from "@/hooks/use-error-page-redirect/useErrorPageRedirect";

import { useGetManagerProductQuery } from "@/store/api/productsApi";
import { useGetManagerProductReservationsQuery } from "@/store/tanstack-api/modules/products";

jest.mock("@/hooks/use-pagination/usePagination");
jest.mock("@/utils/check-screen-size/useScreenSize");
jest.mock("@/hooks/use-error-page-redirect/useErrorPageRedirect");
jest.mock("@/store/api/productsApi");
jest.mock("@/store/tanstack-api/modules/products");
jest.mock("@/components/reserved-product-details/ReservedProductDetails", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked ReservedProductDetails</div>),
}));
jest.mock("@/containers/tables/reservations-table/ReservationsTable", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked ReservationsTable</div>),
}));
jest.mock("@/containers/page-loading-fallback/PageLoadingFallback", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Loading...</div>),
}));

describe("DashboardReservationsContainer", () => {
  const mockRenderRedirect = jest.fn(() => <div>Redirected</div>);

  beforeEach(() => {
    jest.clearAllMocks();
    (usePagination as jest.Mock).mockReturnValue({ page: 1 });
    (useScreenSize as jest.Mock).mockReturnValue({ width: 1200 });
    (useErrorPageRedirect as jest.Mock).mockReturnValue({ renderRedirectComponent: mockRenderRedirect });
  });

  test("renders redirect when no productId", () => {
    render(<DashboardReservationsContainer productId={undefined} />);
    expect(screen.getByText("Redirected")).toBeInTheDocument();
    expect(mockRenderRedirect).toHaveBeenCalled();
  });

  test("renders loading fallback when product is loading", () => {
    (useGetManagerProductQuery as jest.Mock).mockReturnValue({ data: null, isLoading: true, error: null });
    (useGetManagerProductReservationsQuery as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: null });

    render(<DashboardReservationsContainer productId="1" />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders product details and reservations table", () => {
    const mockProduct = { id: "1", image: "", quantity: 1, price: 10, priceWithDiscount: 5, discount: 5, tags: [], productTranslations: [], status: "VISIBLE", percentageOfTotalOrders: null, createdAt: "" };
    (useGetManagerProductQuery as jest.Mock).mockReturnValue({ data: mockProduct, isLoading: false, error: null });
    (useGetManagerProductReservationsQuery as jest.Mock).mockReturnValue({ data: { content: [{ email: "test@test.com", username: "Test User", quantity: 1, addedAt: "" }] }, isLoading: false, error: null });

    render(<DashboardReservationsContainer productId="1" />);

    expect(screen.getByText("Mocked ReservedProductDetails")).toBeInTheDocument();
    expect(screen.getByText("Mocked ReservationsTable")).toBeInTheDocument();
  });
});
