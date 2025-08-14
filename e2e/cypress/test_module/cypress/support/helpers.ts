export const checkUserDetailsInLocalStorage = (
  localStorageValue: string | null,
  role: string
): void => {
  const userDetails = localStorageValue ? JSON.parse(localStorageValue) : null;

  expect(userDetails).to.not.be.null;
  expect(userDetails.token).to.exist;
  expect(userDetails.role).to.eq(role);
};

const createMockProducts = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `product-id-${index + 1}`,
    name: `Product ${index + 1}`,
    image: "...",
    price: 1000.0,
    priceWithDiscount: 800.0
  }));

export const interceptGetProducts = (
  path: string | RegExp,
  count: number = 0,
  alias: string = "getProducts"
) => {
  const mockResponse = {
    totalElements: count,
    content: createMockProducts(count)
  };

  cy.intercept("GET", path, {
    body: mockResponse
  }).as(alias);
};
