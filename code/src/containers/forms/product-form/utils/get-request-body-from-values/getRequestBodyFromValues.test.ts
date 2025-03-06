import { ProductFormValues } from "@/containers/forms/product-form/ProductForm.types";
import getRequestBodyFromValues from "@/containers/forms/product-form/utils/get-request-body-from-values/getRequestBodyFromValues";

const testValues: ProductFormValues = {
  status: true,
  price: 15,
  discount: 10,
  quantity: 10,
  category: 1,
  image: "http://example-image.com",
  productTranslations: [
    { name: "test", description: "test", languageCode: "en" },
    { name: "", description: "", languageCode: "uk" }
  ]
};

const expectedBody = {
  status: "VISIBLE",
  price: 15,
  discount: 10,
  quantity: 10,
  tagIds: [1],
  image: "http://example-image.com",
  productTranslations: [
    { name: "test", description: "test", languageCode: "en" }
  ]
};

const zeroDiscount = { discount: 0 };
const expectedZeroDiscountRes = {};

const bodyWithEmptyDescription: Pick<ProductFormValues, "productTranslations"> =
  {
    productTranslations: [{ name: "test", description: "", languageCode: "en" }]
  };

describe("Test getRequestBodyFromValues", () => {
  test("Should return request body from values", () => {
    const result = getRequestBodyFromValues(testValues);
    expect(result).toEqual(expectedBody);
  });

  test("Should return request body from values with different status", () => {
    const result = getRequestBodyFromValues({ ...testValues, status: false });
    expect(result).toEqual({ ...expectedBody, status: "HIDDEN", discount: 10 });
  });

  test("Should work correctly if only name in translations is filled", () => {
    const result = getRequestBodyFromValues(bodyWithEmptyDescription);
    expect(result).toEqual(bodyWithEmptyDescription);
  });

  test("Should return discount omitted if it is 0", () => {
    const result = getRequestBodyFromValues(zeroDiscount);
    expect(result).toEqual(expectedZeroDiscountRes);
  });

  test("Should not include discount if discount is 0", () => {
    const result = getRequestBodyFromValues({ ...testValues, discount: 0 });
    const expectedWithoutDiscount = {
      status: "VISIBLE",
      price: 15,
      quantity: 10,
      tagIds: [1],
      image: "http://example-image.com",
      productTranslations: [
        { name: "test", description: "test", languageCode: "en" }
      ]
    };
    expect(result).toEqual(expectedWithoutDiscount);
    expect(result).not.toHaveProperty("discount");
  });
});
