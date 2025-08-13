import { screen } from "@testing-library/react";

import MyAddresses from "@/containers/user-account/my-addresses/MyAddresses";

import { useUserDetailsSelector } from "@/store/slices/userSlice";
import { useGetUserAddressesQuery } from "@/store/api/addressApi";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

jest.mock("@/store/slices/userSlice", () => ({
  ...jest.requireActual("@/store/slices/userSlice"),
  useUserDetailsSelector: jest.fn()
}));

jest.mock("@/store/api/addressApi", () => ({
  useGetUserAddressesQuery: jest.fn(),
  useRemoveUserPermanentAddressMutation: jest.fn(() => [jest.fn(), { isLoading: false }])
}));

const mockAddresses = [
  {
    id: "1",
    deliveryMethod: "Nova Poshta",
    city: "Lviv",
    department: "52",
    title: "Home",
    firstName: "John",
    lastName: "Doe",
    phone: "+380960775434"
  },
  {
    id: "2",
    deliveryMethod: "Ukrposhta",
    city: "Kyiv",
    department: "14",
    title: "Office",
    firstName: "Jane",
    lastName: "Smith",
    phone: "+380970123456"
  }
];

const renderAndMock = ({
  addresses = mockAddresses,
  isLoading = false,
  isError = false,
  userId = 4
}: {
  addresses?: typeof mockAddresses;
  isLoading?: boolean;
  isError?: boolean;
  userId?: number | null;
}) => {
  (useUserDetailsSelector as jest.Mock).mockReturnValue(userId ? { id: userId } : null);

  (useGetUserAddressesQuery as jest.Mock).mockReturnValue({
    data: addresses,
    isLoading,
    isError
  });

  return renderWithProviders(<MyAddresses />);
};

describe("MyAddresses", () => {
  test("renders loader when loading", () => {
    renderAndMock({ isLoading: true });
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders empty message when no addresses", () => {
    renderAndMock({ addresses: [] });
    expect(screen.getByText(/myAddresses.emptyMessage/i)).toBeInTheDocument();
  });

  test("renders error message when request fails", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    renderAndMock({ isError: true });

    expect(screen.getByText(/myAddresses.error.label/i)).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  test("renders address cards when addresses are present", () => {
    renderAndMock({});
    expect(screen.getAllByTestId("address-card")).toHaveLength(mockAddresses.length);
  });

  test("throws error if userId is invalid", () => {
    const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

    expect(() => {
        renderAndMock({ userId: null });
    }).toThrow("UserId is required and must be a number");

    consoleErrorSpy.mockRestore();
  });

  test("calls useGetUserAddressesQuery with correct userId", () => {
        const mockUserId = 42;
        (useUserDetailsSelector as jest.Mock).mockReturnValue({ id: mockUserId });

        renderWithProviders(<MyAddresses />);

        expect(useGetUserAddressesQuery).toHaveBeenCalledWith({ userId: mockUserId });
    });
});
