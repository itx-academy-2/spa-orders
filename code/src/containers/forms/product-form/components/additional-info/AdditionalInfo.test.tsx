import { render, screen, waitFor, within } from "@testing-library/react";
import { ControllerRenderProps } from "react-hook-form";

import {
  ProductFormAdditionalInfoSectionProps,
  ProductFormControl,
  ProductFormRegisterFunction
} from "@/containers/forms/product-form/ProductForm.types";
import AdditionalInfo from "@/containers/forms/product-form/components/additional-info/AdditionalInfo";
import useCreateProduct from "@/containers/forms/product-form/hooks/use-create-product/useCreateProduct";

import getTagIn from "@/utils/get-tag-in/getTagIn";

type MockControllerProps = {
  render: (props: { field: ControllerRenderProps }) => JSX.Element;
};

jest.mock("react-hook-form", () => ({
  Controller: ({ render }: MockControllerProps) =>
    render({
      field: { value: 1 } as ControllerRenderProps
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

const renderAdditionalInfo = (
  props?: Partial<ProductFormAdditionalInfoSectionProps>
) => {
  return render(
    <AdditionalInfo
      register={registerFunction}
      control={controlFunction}
      errors={props?.errors ?? {}}
      {...props}
    />
  );
};

describe("Test AdditionalInfo component", () => {
  test("Should render inputs", () => {
    renderAdditionalInfo();

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
    renderAdditionalInfo();

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
    renderAdditionalInfo();

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

    renderAdditionalInfo({ errors: errorsWithMessages });

    expect(
      screen.getByText("Price must be a positive number")
    ).toBeInTheDocument();
    expect(screen.getByText("Quantity is required")).toBeInTheDocument();
  });

  test("Should disable discount input when discountedProductsCount equals 10", () => {
    (useCreateProduct as jest.Mock).mockReturnValue([null, 10]);
    renderAdditionalInfo();

    const discountInputContainer = screen.getByTestId(
      "product-form-discount-input"
    );
    const discountInput = discountInputContainer.querySelector("input");
    expect(discountInput).toBeDisabled();
  });

  test("Should enable discount input when discountedProductsCount is not 10", () => {
    (useCreateProduct as jest.Mock).mockReturnValue([null, 5]);
    renderAdditionalInfo();

    const discountInputContainer = screen.getByTestId(
      "product-form-discount-input"
    );
    const discountInput = discountInputContainer.querySelector("input");
    expect(discountInput).not.toBeDisabled();
  });

  test("Should not call setValue when discountedProductsCount is not equal to 10", async () => {
    (useCreateProduct as jest.Mock).mockReturnValue([null, 5]);
    const setValueMock = jest.fn();
    renderAdditionalInfo({ setValue: setValueMock });

    await waitFor(() => expect(setValueMock).not.toHaveBeenCalled());
  });

  test("Should show remove discount button", () => {
    renderAdditionalInfo({ showRemoveDiscountBtn: true });

    const discountRemovalBtn = screen.getByTestId(
      "product-form-discount-remove"
    );

    expect(discountRemovalBtn).toBeInTheDocument();
  });

  test("Should not show remove discount button", () => {
    renderAdditionalInfo();

    const discountRemovalBtn = screen.queryByTestId(
      "product-form-discount-remove"
    );

    expect(discountRemovalBtn).not.toBeInTheDocument();
  });

  test("Should call passed onRemoveDiscount", () => {
    const mockOnRemoveDiscount = jest.fn();

    renderAdditionalInfo({
      showRemoveDiscountBtn: true,
      onRemoveDiscount: mockOnRemoveDiscount
    });

    const discountRemovalBtn = screen.getByTestId(
      "product-form-discount-remove"
    );

    discountRemovalBtn.click();

    expect(mockOnRemoveDiscount).toHaveBeenCalled();
  });

  test("Should display discount value in discount input when discount is not 0 and disabled", () => {
    (useCreateProduct as jest.Mock).mockReturnValue([null, 10]);
    renderAdditionalInfo();

    const discountInput = screen.getByTestId("product-form-discount-input");
    expect(discountInput).not.toHaveValue("");
  });

  test("Should display discount value in discount input when discount is not 0 and enabled", () => {
    (useCreateProduct as jest.Mock).mockReturnValue([null, 5]);
    renderAdditionalInfo();

    const discountInput = screen.getByTestId("product-form-discount-input");
    expect(discountInput).not.toHaveValue("");
  });

  test("Should display category error message when errors.category is present", () => {
    const categoryErrorMessage = "Category is required";
    renderAdditionalInfo({
      errors: {
        category: { message: categoryErrorMessage, type: "manual" }
      }
    });

    expect(screen.getByText(categoryErrorMessage)).toBeInTheDocument();

    const categorySelect = screen.getByTestId("product-form-category-select");

    expect(categorySelect.closest(".Mui-error")).toBeTruthy();
  });

  test("Should NOT display category error message when errors.category is not defined", () => {
    renderAdditionalInfo();

    const errorText = screen.queryByText("Category is required");

    expect(errorText).not.toBeInTheDocument();

    const categorySelect = screen.getByTestId("product-form-category-select");

    expect(categorySelect.closest(".Mui-error")).toBeFalsy();
  });
});
