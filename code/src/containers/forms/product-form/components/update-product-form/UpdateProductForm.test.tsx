import { act, fireEvent, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import UpdateProductForm from "@/containers/forms/product-form/components/update-product-form/UpdateProductForm";

import { FullManagerProduct, UpdateProductBody } from "@/types/product.types";
import getTagIn from "@/utils/get-tag-in/getTagIn";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";
import typeIntoInput from "@/utils/type-into-input/typeIntoInput";

import { UseUpdateProductOptions } from "../../hooks/use-update-product/useUpdateProduct.types";

const mockUnwrap = jest.fn();
const mockUpdateProduct: (arg: UpdateProductBody) => void = jest.fn(() => ({
  unwrap: mockUnwrap
}));

jest.mock(
  "@/containers/forms/product-form/hooks/use-update-product/useUpdateProduct",
  () => ({
    __esModule: true,
    default: (args?: UseUpdateProductOptions) => {
      return [
        (body: UpdateProductBody) => {
          args?.onSuccess && args.onSuccess();
          return mockUpdateProduct(body);
        },
        { isLoading: false }
      ];
    }
  })
);

jest.mock("@/store/api/productsApi", () => ({
  useCreateProductMutation: jest.fn(() => [jest.fn(), {}]),
  useGetDiscountedProductsCountQuery: jest.fn(() => ({ data: 0 }))
}));

const testData: FullManagerProduct = {
  id: "1",
  createdAt: "2021-10-10T10:10:10.000Z",
  status: "HIDDEN",
  image: "https://example.com",
  quantity: 10,
  price: 100,
  tags: [{ id: 1, name: "category:mobile" }],
  priceWithDiscount: null,
  discount: null,
  productTranslations: [
    {
      name: "name",
      description: "description-description",
      languageCode: "en"
    }
  ]
};

const changedValues = {
  ...testData,
  price: undefined,
  quantity: undefined
} as unknown as FullManagerProduct;

const expectedChangedProductBody = {
  productId: "1",
  status: "VISIBLE",
  price: 100,
  discount: 10,
  quantity: 100,
  tagIds: [3],
  image: "https://example.com"
};

let imgUrlInput: HTMLInputElement;
let priceInput: HTMLInputElement;
let quantityInput: HTMLInputElement;
let discountInput: HTMLInputElement;
let categorySelect: HTMLSpanElement;
let nameInput: HTMLInputElement;
let descriptionInput: HTMLTextAreaElement;
let submitButton: HTMLButtonElement;
let statusInput: HTMLInputElement;

const render = (
  data: FullManagerProduct = testData,
  confirmResult: boolean = true
) => {
  jest.spyOn(window, "confirm").mockReturnValue(confirmResult);

  const result = renderWithProviders(<UpdateProductForm product={data} />);

  imgUrlInput = getTagIn("product-form-image-input");
  priceInput = getTagIn("product-form-price-input");
  quantityInput = getTagIn("product-form-quantity-input");
  discountInput = getTagIn("product-form-discount-input");
  categorySelect = screen.getByLabelText("product.category");
  nameInput = getTagIn(`product-form-name-input`);
  descriptionInput = getTagIn(`product-form-description-input`, "textarea");
  statusInput = getTagIn("product-form-status-checkbox");
  submitButton = screen.getByText("productForm.update.submit");

  return result;
};

const submit = async () => await act(async () => fireEvent.click(submitButton));

const selectCategory = async () => {
  await act(async () => fireEvent.mouseDown(categorySelect));
  const categoryOption = screen.getByText("productsAll.computer");
  await act(async () => fireEvent.click(categoryOption));
};

describe("Test UpdateProductForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should be rendered correctly", () => {
    render();

    const imageSectionTitle = screen.getByText(
      "dashboardProduct.section.image.title"
    );
    const mainInforEnSectionTitle = screen.getByText(
      "dashboardProduct.section.mainInformation.title"
    );
    const additionalInfoSectionTitle = screen.getByText(
      "dashboardProduct.section.additionalInformation.title"
    );

    expect(imageSectionTitle).toBeInTheDocument();
    expect(mainInforEnSectionTitle).toBeInTheDocument();
    expect(additionalInfoSectionTitle).toBeInTheDocument();
  });

  test("Should show helper texts if validation failed", async () => {
    render(changedValues);

    await typeIntoInput(imgUrlInput, "invalid-url");
    await typeIntoInput(descriptionInput, "short");
    await typeIntoInput(nameInput, "-");

    await submit();

    const nameHelperText = screen.getByText("Name is too short");
    const descriptionHelperText = screen.getByText("Description is too short");
    const imageUrlHelperText = screen.getByText("Please provide a valid URL");
    const priceHelperText = screen.getByText("Invalid price");
    const quantityHelperText = screen.getByText("Invalid quantity");

    expect(nameHelperText).toBeInTheDocument();
    expect(descriptionHelperText).toBeInTheDocument();
    expect(imageUrlHelperText).toBeInTheDocument();
    expect(priceHelperText).toBeInTheDocument();
    expect(quantityHelperText).toBeInTheDocument();
  });

  test("Should show error if name and description not filled", async () => {
    render({ ...testData, productTranslations: [] });

    await typeIntoInput(imgUrlInput, testData.image);
    await typeIntoInput(priceInput, testData.price);
    await typeIntoInput(quantityInput, testData.quantity);

    await selectCategory();
    await submit();

    const helperText = screen.getAllByText(
      "At least one translation must have non-empty name and description"
    );
    expect(helperText.length).toBe(2);
  });

  test("Should send request with only changed values", async () => {
    render(changedValues);

    await act(async () => fireEvent.click(statusInput));
    await selectCategory();
    await userEvent.type(priceInput, "100");
    await userEvent.type(quantityInput, "100");
    await userEvent.type(discountInput, "10");

    await submit();

    expect(mockUpdateProduct).toHaveBeenCalledWith(expectedChangedProductBody);
  });

  test("Should not send request if nothing was changed", async () => {
    render();

    await submit();

    expect(mockUpdateProduct).not.toHaveBeenCalled();
  });

  test("Should send request to remove discount", () => {
    render({ ...testData, discount: 10 });

    const discountRemovalBtn = screen.getByTestId(
      "product-form-discount-remove"
    );

    fireEvent.click(discountRemovalBtn);

    expect(mockUpdateProduct).toHaveBeenCalledWith({
      productId: testData.id,
      discount: undefined,
      image: "https://example.com"
    });
  });

  test("Should not send request to remove discount when user cancels it", () => {
    render({ ...testData, discount: 10 }, false);

    const discountRemovalBtn = screen.getByTestId(
      "product-form-discount-remove"
    );

    fireEvent.click(discountRemovalBtn);

    expect(mockUpdateProduct).not.toHaveBeenCalled();
  });
});
