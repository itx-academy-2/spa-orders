import { render, screen, waitFor, within } from "@testing-library/react";
import { ControllerRenderProps } from "react-hook-form";
import { UseFormSetValue } from "react-hook-form";

import {
  ProductFormControl,
  ProductFormFieldErrors,
  ProductFormRegisterFunction,
  ProductFormValues
} from "@/containers/forms/product-form/ProductForm.types";
import CreateAdditionalInfo from "@/containers/forms/product-form/components/create-additional-info/CreateAdditionalInfo";
import useCreateProduct from "@/containers/forms/product-form/hooks/use-create-product/useCreateProduct";

import getTagIn from "@/utils/get-tag-in/getTagIn";

type SetValueType = UseFormSetValue<ProductFormValues>;

jest.mock("react-hook-form", () => ({
  Controller: ({
    render
  }: {
    render: (props: { field: ControllerRenderProps }) => JSX.Element;
  }) =>
    render({
      field: {
        value: 1,
        onChange: jest.fn(),
        onBlur: jest.fn(),
        name: "test",
        ref: jest.fn()
      } as unknown as ControllerRenderProps
    }),
  useWatch: jest.fn(() => 0)
}));

jest.mock(
  "@/containers/forms/product-form/hooks/use-create-product/useCreateProduct",
  () => ({
    __esModule: true,
    default: jest.fn(() => [null, 0])
  })
);

const registerFunction = (() => ({})) as unknown as ProductFormRegisterFunction;
const controlFunction = (() => ({})) as unknown as ProductFormControl;

const renderCreateAdditionalInfo = (
  errors: ProductFormFieldErrors = {},
  setValue?: SetValueType
) => {
  return render(
    <CreateAdditionalInfo
      register={registerFunction}
      errors={errors}
      control={controlFunction}
      setValue={setValue}
    />
  );
};

describe("Test CreateAdditionalInfo component", () => {
  test("Should render inputs", () => {
    renderCreateAdditionalInfo();

    const categorySelect = screen.getByTestId("product-form-category-select");
    const priceInput = getTagIn("product-form-price-input");
    const quantityInput = getTagIn("product-form-quantity-input");
    const discountInputContainer = screen.getByTestId(
      "product-form-discount-input"
    );
    const discountedPriceInput = screen.getByTestId(
      "product-form-discounted-price-input"
    );
    const statusCheckbox = screen.getByTestId("product-form-status-checkbox");

    expect(discountedPriceInput).toBeInTheDocument();
    expect(discountInputContainer).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(quantityInput).toBeInTheDocument();
    expect(categorySelect).toBeInTheDocument();
    expect(statusCheckbox).toBeInTheDocument();
  });

  test("Inputs should have appropriate attributes and classnames", () => {
    renderCreateAdditionalInfo();

    const selectInput = document.querySelector(
      ".product-form__category-select"
    );
    const priceInput = getTagIn("product-form-price-input");
    const quantityInput = getTagIn("product-form-quantity-input");
    const discountInputContainer = screen.getByTestId(
      "product-form-discount-input"
    );
    const discountInput = within(discountInputContainer).getByRole(
      "spinbutton"
    );

    expect(selectInput).toBeInTheDocument();
    expect(priceInput).toHaveAttribute("min", "0");
    expect(quantityInput).toHaveAttribute("min", "0");
    expect(discountInput).toHaveAttribute("min", "0");
  });

  test("Should not show error by default", () => {
    renderCreateAdditionalInfo();

    const priceInput = screen.getByTestId("product-form-price-input");
    const quantityInput = screen.getByTestId("product-form-quantity-input");

    expect(priceInput.closest(".Mui-error")).toBeFalsy();
    expect(quantityInput.closest(".Mui-error")).toBeFalsy();
  });

  test("Should display error messages for price and quantity when errors are present", () => {
    const errorsWithMessages = {
      price: { message: "Price must be a positive number", type: "manual" },
      quantity: { message: "Quantity is required", type: "manual" }
    };

    renderCreateAdditionalInfo(errorsWithMessages);

    expect(
      screen.getByText("Price must be a positive number")
    ).toBeInTheDocument();
    expect(screen.getByText("Quantity is required")).toBeInTheDocument();
  });

  test("Should disable discount input when discountedProductsCount equals 10", () => {
    (useCreateProduct as jest.Mock).mockReturnValue([null, 10]);
    renderCreateAdditionalInfo();

    const discountInputContainer = screen.getByTestId(
      "product-form-discount-input"
    );
    const discountInput = discountInputContainer.querySelector("input");
    expect(discountInput).toBeDisabled();
  });

  test("Should enable discount input when discountedProductsCount is not 10", () => {
    (useCreateProduct as jest.Mock).mockReturnValue([null, 5]);
    renderCreateAdditionalInfo();

    const discountInputContainer = screen.getByTestId(
      "product-form-discount-input"
    );
    const discountInput = discountInputContainer.querySelector("input");
    expect(discountInput).not.toBeDisabled();
  });

  test("Should call setValue with discount value 0 when discountedProductsCount equals 10", async () => {
    (useCreateProduct as jest.Mock).mockReturnValue([null, 10]);
    const setValueMock = jest.fn();
    renderCreateAdditionalInfo({}, setValueMock);

    await waitFor(() =>
      expect(setValueMock).toHaveBeenCalledWith("discount", 0)
    );
  });

  test("Should not call setValue when discountedProductsCount is not equal to 10", async () => {
    (useCreateProduct as jest.Mock).mockReturnValue([null, 5]);
    const setValueMock = jest.fn();
    renderCreateAdditionalInfo({}, setValueMock);

    await waitFor(() => expect(setValueMock).not.toHaveBeenCalled());
  });
});

test("Should display discount value in discount input when discount is not 0 and disabled", () => {
  (useCreateProduct as jest.Mock).mockReturnValue([null, 10]);
  renderCreateAdditionalInfo();

  const discountInput = screen.getByTestId("product-form-discount-input");
  expect(discountInput).not.toHaveValue("");
});

test("Should display discount value in discount input when discount is not 0 and enabled", () => {
  (useCreateProduct as jest.Mock).mockReturnValue([null, 5]);
  renderCreateAdditionalInfo();

  const discountInput = screen.getByTestId("product-form-discount-input");
  expect(discountInput).not.toHaveValue("");
});
