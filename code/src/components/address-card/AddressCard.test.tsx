import { screen } from "@testing-library/react";

import { useUserDetailsSelector } from "@/store/slices/userSlice";
import { useRemoveUserPermanentAddressMutation } from "@/store/api/addressApi";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

import AddressCard from "@/components/address-card/AddressCard";

jest.mock("@/store/slices/userSlice", () => ({
  ...jest.requireActual("@/store/slices/userSlice"),
  useUserDetailsSelector: jest.fn(),
}));

jest.mock("@/store/api/addressApi", () => ({
  useRemoveUserPermanentAddressMutation: jest.fn(),
}));

const mockedAddress = {
  id: "1",
  title: "Home",
  firstName: "John",
  lastName: "Doe",
  phone: "+380960000001",
  city: "Lviv",
  postMethod: "NOVA_POSHTA",
  department: "52",
};

const renderAndMock = ({
  userId = 4,
  isLoading = false,
  removeAddressMock = jest.fn().mockResolvedValue({}),
} = {}) => {
  (useUserDetailsSelector as jest.Mock).mockReturnValue(userId ? { id: userId } : null);

  (useRemoveUserPermanentAddressMutation as jest.Mock).mockReturnValue([
    removeAddressMock,
    { isLoading },
  ]);

  return renderWithProviders(<AddressCard address={mockedAddress} />);
};

describe("AddressCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders address card correctly", () => {
    renderAndMock();
    expect(screen.getByText(mockedAddress.title)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockedAddress.firstName} ${mockedAddress.lastName}`)
    ).toBeInTheDocument();
    expect(screen.getByText(mockedAddress.phone)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockedAddress.city}, ${mockedAddress.postMethod}, ${mockedAddress.department}`)
    ).toBeInTheDocument();
  });

  test("remove button is disabled when loading", () => {
    renderAndMock({ isLoading: true });

    expect(screen.getByTestId("remove-address")).toBeDisabled();
  });
});
