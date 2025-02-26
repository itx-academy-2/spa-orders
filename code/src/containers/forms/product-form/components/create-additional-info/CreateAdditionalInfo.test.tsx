import { render, screen } from "@testing-library/react";
import { ControllerRenderProps } from "react-hook-form";

import {
  ProductFormControl,
  ProductFormFieldErrors,
  ProductFormRegisterFunction
} from "@/containers/forms/product-form/ProductForm.types";
import CreateAdditionalInfo from "@/containers/forms/product-form/components/create-additional-info/CreateAdditionalInfo";

import getTagIn from "@/utils/get-tag-in/getTagIn";

type MockControllerProps = {
  render: (props: { field: ControllerRenderProps }) => JSX.Element;
};

jest.mock("react-hook-form", () => ({
  Controller: ({ render }: MockControllerProps) =>
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

const registerFunction = (() => ({})) as unknown as ProductFormRegisterFunction;
const controlFunction = (() => ({})) as unknown as ProductFormControl;

const renderCreateAdditionalInfo = (errors: ProductFormFieldErrors = {}) => {
  return render(
    <CreateAdditionalInfo
      register={registerFunction}
      errors={errors}
      control={controlFunction}
    />
  );
};

describe("Test CreateAdditionalInfo component", () => {
  test("Should render inputs", () => {
    renderCreateAdditionalInfo();

    const categorySelect = screen.getByTestId("product-form-category-select");
    const priceInput = getTagIn("product-form-price-input");
    const quantityInput = getTagIn("product-form-quantity-input");
    const discountInput = screen.getByTestId("product-form-discount-input");
    const discountedPriceInput = screen.getByTestId(
      "product-form-discounted-price-input"
    );
    const statusCheckbox = screen.getByTestId("product-form-status-checkbox");

    expect(discountedPriceInput).toBeInTheDocument();
    expect(discountInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(quantityInput).toBeInTheDocument();
    expect(categorySelect).toBeInTheDocument();
    expect(statusCheckbox).toBeInTheDocument();
  });

  test("Inputs should have appropriate attributes and classnames", () => {
    const { container } = renderCreateAdditionalInfo();

    const selectInput = container.querySelector(
      ".product-form__category-select"
    );
    const priceInput = getTagIn("product-form-price-input");
    const quantityInput = getTagIn("product-form-quantity-input");
    const discountInput = getTagIn("product-form-discount-input");

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

    const priceText = screen.getByText("Price must be a positive number");

    expect(priceText).toBeInTheDocument();

    expect(screen.getByText("Quantity is required")).toBeInTheDocument();
  });
});
