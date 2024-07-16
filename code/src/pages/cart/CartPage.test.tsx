import { screen } from "@testing-library/react";

import useCreateOrder from "@/hooks/use-create-order/useCreateOrder";
import useGetCart from "@/hooks/use-get-cart/useGetCart";
import useUserDetailsSelector from "@/hooks/use-get-user-details/useGetUserDetails";
import useRemoveFromCart from "@/hooks/use-remove-from-cart/useRemoveFromCart";
import CartPage from "@/pages/cart/CartPage";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

type RenderWithMockParams = {
  data?: typeof mockedCartItems | null;
  isLoading?: boolean;
  error?: boolean;
};

jest.mock("@/hooks/use-get-user-details/useGetUserDetails", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("@/hooks/use-create-order/useCreateOrder", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("@/store/api/cartApi", () => ({
  endpoints: {
    getCartItems: {
      matchFulfilled: jest.fn()
    }
  }
}));

jest.mock("@/hooks/use-get-cart/useGetCart");
jest.mock("@/hooks/use-remove-from-cart/useRemoveFromCart");

jest.mock("@/utils/format-price/formatPrice");

const mockUseGetUserDetails = useUserDetailsSelector as jest.Mock;
const mockUseGetCart = useGetCart as jest.Mock;
const mockuseRemoveFromCart = useRemoveFromCart as jest.Mock;

const mockCreateOrder = jest.fn();

const mockedCartItems = {
  items: [
    {
      productId: "8efbee82-8a0c-407a-a4c0-16bbad40a23e",
      image: "https://example.com/phone.jpg",
      name: "Iphone",
      productPrice: 100.45,
      quantity: 2,
      calculatedPrice: 200.9
    }
  ],
  totalPrice: 1000.45
};

const userId = { id: 3 };

const renderWithMockParams = ({
  data = null,
  error = false
}: RenderWithMockParams) => {
  mockUseGetCart.mockReturnValue({
    data,
    error
  });

  mockuseRemoveFromCart.mockReturnValue([jest.fn()]);

  renderWithProviders(<CartPage />);
};

describe("CartPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetUserDetails.mockReturnValue(userId);
    (useCreateOrder as jest.Mock).mockReturnValue([mockCreateOrder, {}]);
  });

  test("renders error state when there is an error fetching cart items", () => {
    renderWithMockParams({ error: true });

    const errorMessage = screen.getByText(/error.label/);
    expect(errorMessage).toBeInTheDocument();
  });

  test("renders cart items and order summary correctly", () => {
    renderWithMockParams({ data: mockedCartItems });

    const myCartLabel = screen.getByTestId("myCartLabel");
    expect(myCartLabel).toBeInTheDocument();

    const orderSummaryLabel = screen.getByTestId("orderSummaryLabel");
    expect(orderSummaryLabel).toBeInTheDocument();

    const subtotalLabel = screen.getByTestId("subtotalLabel");
    expect(subtotalLabel).toBeInTheDocument();

    const deliveryLabel = screen.getByTestId("deliveryLabel");
    expect(deliveryLabel).toBeInTheDocument();

    const freeLabel = screen.getByTestId("freeLabel");
    expect(freeLabel).toBeInTheDocument();

    const countryLabel = screen.getByTestId("countryLabel");
    expect(countryLabel).toBeInTheDocument();

    const totalLabel = screen.getByTestId("totalLabel");
    expect(totalLabel).toBeInTheDocument();

    const createOrderButton = screen.getByTestId("createOrderButton");
    expect(createOrderButton).toBeInTheDocument();

    const cartItemName = screen.getByText("Iphone");
    expect(cartItemName).toBeInTheDocument();
  });
});
