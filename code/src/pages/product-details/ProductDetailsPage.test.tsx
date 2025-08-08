import { screen } from "@testing-library/react";
import { useParams } from "react-router-dom";

import { ROLES } from "@/constants/common";
import ProductDetailsPage from "@/pages/product-details/ProductDetailsPage";
import { productNotFoundRedirectConfig } from "@/pages/product-details/ProductsDetailsPage.constants";
import { useUpdateViewedProductsMutation } from "@/store/api/viewHistoryApi";
import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";
import {
  useIsAuthSelector,
  useUserRoleSelector
} from "@/store/slices/userSlice";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

type RoleType = (typeof ROLES)[keyof typeof ROLES];

const mockRenderRedirectComponent = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn()
}));

jest.mock("@/store/api/viewHistoryApi", () => ({
  useUpdateViewedProductsMutation: jest.fn()
}));

jest.mock("@/hooks/use-error-page-redirect/useErrorPageRedirect", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    renderRedirectComponent: mockRenderRedirectComponent
  }))
}));

jest.mock("@/store/api/wishlistApi", () => ({
  useGetUserWishlistQuery: jest.fn()
}));

jest.mock(
  "@/pages/product-details/components/product-details-container/ProductDetailsContainer",
  () => ({
    __esModule: true,
    default: () => <div>ProductDetailsContainer</div>
  })
);
jest.mock("@/store/slices/userSlice", () => ({
  useIsAuthSelector: jest.fn(),
  useUserRoleSelector: jest.fn()
}));
const addViewedProductMock = jest.fn();
const renderAndMock = (
  productId?: string,
  isAuthenticated?: boolean,
  currentRole?: RoleType | null,
  wishlistData?: { content: [] }
) => {
  (useParams as jest.Mock).mockReturnValue({ productId });
  (useUpdateViewedProductsMutation as jest.Mock).mockReturnValue([
    addViewedProductMock
  ]);
  (useIsAuthSelector as jest.Mock).mockReturnValue(isAuthenticated);
  (useUserRoleSelector as jest.Mock).mockReturnValue(currentRole);
  (useGetUserWishlistQuery as jest.Mock).mockReturnValue({ data: wishlistData });

  renderWithProviders(<ProductDetailsPage />);
};

describe("ProductDetailsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("redirects to 404 page if productId is not provided", () => {
    renderAndMock(undefined, false);
    expect(mockRenderRedirectComponent).toHaveBeenCalledWith(
      productNotFoundRedirectConfig
    );
  });

  test("renders product details container when product id is defined", () => {
    renderAndMock("1", false);
    expect(mockRenderRedirectComponent).not.toHaveBeenCalled();

    const productDetailsContainer = screen.getByText("ProductDetailsContainer");
    expect(productDetailsContainer).toBeInTheDocument();
  });

  test("calls addViewProduct with productId when productId is defined", () => {
    renderAndMock("2", true, ROLES.USER);
    expect(addViewedProductMock).toHaveBeenCalledWith("2");
  });

  test("does not addViewProduct when user is not authenticated", () => {
    renderAndMock("3", false);
    expect(addViewedProductMock).not.toHaveBeenCalled();
  });

  test("does not addViewProduct when user role is Admin", () => {
    renderAndMock("3", true, ROLES.ADMIN);
    expect(addViewedProductMock).not.toHaveBeenCalled();
  });

  test("does not addViewProduct when user role is Manager", () => {
    renderAndMock("3", true, ROLES.SHOP_MANAGER);
    expect(addViewedProductMock).not.toHaveBeenCalled();
  });

  test("does not addViewProduct when user role is null", () => {
    renderAndMock("3", true, null);
    expect(addViewedProductMock).not.toHaveBeenCalled();
  });
});
