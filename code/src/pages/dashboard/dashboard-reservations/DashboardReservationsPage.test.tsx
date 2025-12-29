import { render, screen } from "@testing-library/react";
import { useParams } from "react-router-dom";

import DashboardReservationsPage from "@/pages/dashboard/dashboard-reservations/DashboardReservationsPage";

import useErrorPageRedirect from "@/hooks/use-error-page-redirect/useErrorPageRedirect";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

jest.mock("@/pages/dashboard/dashboard-reservations/components/DashboardReservationsContainer", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked Container</div>),
}));

jest.mock("@/hooks/use-error-page-redirect/useErrorPageRedirect", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("DashboardReservationsPage", () => {
  const mockRenderRedirect = jest.fn(() => <div>Redirected</div>);

  beforeEach(() => {
    (useErrorPageRedirect as jest.Mock).mockReturnValue({ renderRedirectComponent: mockRenderRedirect });
  });

  test("renders container when productId exists", () => {
    (useParams as jest.Mock).mockReturnValue({ productId: "1" });

    render(<DashboardReservationsPage />);

    expect(screen.getByText("Mocked Container")).toBeInTheDocument();
    expect(mockRenderRedirect).not.toHaveBeenCalled();
  });

  test("renders redirect when productId is missing", () => {
    (useParams as jest.Mock).mockReturnValue({ productId: undefined });

    render(<DashboardReservationsPage />);

    expect(screen.getByText("Redirected")).toBeInTheDocument();
    expect(mockRenderRedirect).toHaveBeenCalled();
  });
});
