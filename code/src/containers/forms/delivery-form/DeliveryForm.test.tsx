import { fireEvent, screen, waitFor } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import DeliveryForm from "@/containers/forms/delivery-form/DeliveryForm";

import { useGetUserAddressesQuery } from "@/store/api/addressApi";
import { useCreateOrderV2Mutation } from "@/store/api/ordersApi";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

const mockOpenSnackbar = jest.fn();

jest.mock("@/hooks/use-get-user-details/useGetUserDetails", () => ({
  __esModule: true,
  default: () => ({ id: "user123" })
}));

jest.mock("@/hooks/use-snackbar/useSnackbar", () => ({
  __esModule: true,
  default: () => ({
    openSnackbarWithTimeout: mockOpenSnackbar
  })
}));
const mockCreateOrder = jest.fn();
jest.mock("@/store/api/ordersApi", () => ({
  __esModule: true,
  useCreateOrderV2Mutation: jest.fn()
}));

jest.mock("@/hooks/use-address-sync/useAddressSync", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("@/store/api/addressApi", () => ({
  useGetUserAddressesQuery: jest.fn()
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

const errorSnackbarConfig = {
  variant: "error",
  messageTranslationKey: "deliveryForm.errorMessage"
};

const errorGenericSnackbarConfig = {
  variant: "error",
  messageTranslationKey: "deliveryForm.genericErrorMessage"
};

const renderAndMock = ({
  isSuccess = true,
  isError = false,
  error = {}
}: {
  isSuccess?: boolean;
  isError?: boolean;
  error?: Record<string, unknown>;
} = {}) => {
  (useCreateOrderV2Mutation as jest.Mock).mockReturnValue([
    mockCreateOrder,
    { isSuccess, isError, error }
  ]);

  (useGetUserAddressesQuery as jest.Mock).mockReturnValue({
    data: mockAddresses
  });
  return renderWithProviders(<DeliveryForm totalPrice={100} />);
};

describe("DeliveryForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the delivery form", () => {
    renderAndMock();
    const title = screen.getByText("deliveryForm.title");

    expect(title).toBeInTheDocument();
  });

  it("should call createOrder with correct data on form submission when title is empty", async () => {
    renderAndMock();

    await userEvent.clear(
      screen.getByRole("textbox", { name: "deliveryForm.firstName" })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "deliveryForm.firstName" }),
      "Another"
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: "deliveryForm.lastName" })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "deliveryForm.lastName" }),
      "Person"
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: "deliveryForm.phone" })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "deliveryForm.phone" }),
      "0987654321"
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: "deliveryForm.city" })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "deliveryForm.city" }),
      "AnotherCity"
    );

    await userEvent.clear(
      screen.getByRole("textbox", { name: "deliveryForm.department" })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "deliveryForm.department" }),
      "202"
    );

    await userEvent.click(screen.getByTestId("delivery-method"));

    const option = await screen.findByText(
      "dashboardTabs.orders.filters.novaPost"
    );
    await userEvent.click(option);

    const form = screen.getByTestId("delivery-form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalledTimes(1);
      expect(mockCreateOrder).toHaveBeenCalledWith({
        userId: "user123",
        firstName: "Another",
        lastName: "Person",
        phone: "0987654321",
        city: "AnotherCity",
        department: "202",
        deliveryMethod: "NOVA",
        title: null
      });
    });

    expect(mockOpenSnackbar).toHaveBeenCalledTimes(1);
  });

  it("renders mocked address options and displays selected value from renderValue", async () => {
    renderAndMock();
    const allComboboxes = screen.getAllByRole("combobox");
    const dropdown = allComboboxes[0];

    await userEvent.click(dropdown);

    const menu = await screen.findByRole("listbox");
    expect(menu).toBeInTheDocument();

    const optionHome = await screen.findByTestId("address-Home");
    expect(optionHome).toBeInTheDocument();

    await userEvent.click(optionHome);

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("should toggle checkbox state on click", async () => {
    renderAndMock();

    const checkbox = screen.getByLabelText("deliveryForm.checkboxLabel");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("should show error message when status 409", () => {
    renderAndMock({ isSuccess: false, isError: true, error: { status: 409 } });

    expect(mockOpenSnackbar).toHaveBeenCalledTimes(1);
    expect(mockOpenSnackbar).toHaveBeenCalledWith(errorSnackbarConfig);
  });

  it("should show generic error message for non-409 errors", () => {
    renderAndMock({ isSuccess: false, isError: true, error: { status: 500 } });

    expect(mockOpenSnackbar).toHaveBeenCalledTimes(1);
    expect(mockOpenSnackbar).toHaveBeenCalledWith(errorGenericSnackbarConfig);
  });
});
