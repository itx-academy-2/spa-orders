import { renderHook } from "@testing-library/react";

import useCreateProduct from "@/containers/forms/product-form/hooks/use-create-product/useCreateProduct";

import routes from "@/constants/routes";
import { ProductBody } from "@/types/product.types";

const mockUnwrap = jest.fn().mockResolvedValue({ id: 1 });
const mockNavigate = jest.fn();
const mockOpenSnackbar = jest.fn();
const mockCreateProduct = jest.fn(() => ({ unwrap: mockUnwrap }));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
}));

jest.mock("@/hooks/use-snackbar/useSnackbar", () => ({
  __esModule: true,
  default: () => ({
    openSnackbarWithTimeout: mockOpenSnackbar
  })
}));

jest.mock("@/store/api/productsApi", () => ({
  useCreateProductMutation: () => [mockCreateProduct, {}],
  useGetDiscountedProductsCountQuery: () => ({ data: 0 })
}));

const successSnackbarConfig = {
  variant: "success",
  messageTranslationKey: "productForm.creation.success"
};

const errorSnackbarConfig = {
  variant: "error",
  messageTranslationKey: "productForm.creation.fail"
};

const testProductData: ProductBody = {
  status: "HIDDEN",
  image: "https://example.com",
  quantity: 10,
  price: 100,
  discount: 10,
  tagIds: [1],
  productTranslations: [
    {
      name: "name",
      description: "description-description",
      languageCode: "en"
    }
  ]
};

describe("Test useCreateProduct hook", () => {
  test("Should return three values", () => {
    const { result } = renderHook(() => useCreateProduct());
    const [createProduct, discountedProductsCount, requestState] =
      result.current;

    expect(discountedProductsCount).toBe(0);
    expect(requestState).toBeTruthy();
    expect(createProduct).toBeTruthy();
  });

  test("Should call create product function with right parameters", () => {
    const { result } = renderHook(() => useCreateProduct());

    const [createProduct] = result.current;
    createProduct(testProductData);

    expect(mockCreateProduct).toHaveBeenCalledWith(testProductData);
  });

  test("Should call open snackbar with success message and redirect if success", async () => {
    const { result } = renderHook(() => useCreateProduct());

    const [createProduct] = result.current;
    await createProduct(testProductData);

    expect(mockOpenSnackbar).toHaveBeenCalledWith(successSnackbarConfig);

    const expectedPath = routes.dashboard.products.productDetails.path("1");

    expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
  });

  test("Should call open snackbar with error message if error", async () => {
    mockUnwrap.mockRejectedValueOnce({});

    const { result } = renderHook(() => useCreateProduct());

    const [createProduct] = result.current;
    await createProduct(testProductData);

    expect(mockOpenSnackbar).toHaveBeenCalledWith(errorSnackbarConfig);
  });
});
