import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { httpMethod } from "@cypress-e2e/fixtures/global-data";

const mockViewHistoryEmpty = {
  totalElements: 0,
  content: []
};

const createMockProducts = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `product-id-${index + 1}`,
    name: `Product ${index + 1}`,
    image: "...",
    price: 1000.0,
    priceWithDiscount: 800.0
  }));

const interceptViewHistoryWithProducts = (count: number) => {
  const mockViewHistory = {
    totalElements: count,
    content: createMockProducts(count)
  };

  cy.intercept(httpMethod.get, /\/api\/v1\/my-view-history/, {
    body: mockViewHistory
  }).as("getViewHistory");
};

Given(
  "The view history page is loaded with {int} product(s)",
  (count: number) => {
    interceptViewHistoryWithProducts(count);

    cy.visit("/user-cabinet/view-history");
    cy.wait("@getViewHistory");
  }
);

When("The user clicks the delete icon on that product card", () => {
  cy.intercept(httpMethod.delete, /\/api\/v1\/my-view-history/, {
    statusCode: 204
  }).as("deleteProduct");
  cy.get('[data-cy="delete-product-from-history"]').first().click();

  cy.wait("@deleteProduct");
});

Given("The view history page is loaded with an empty list", () => {
  cy.intercept(httpMethod.get, /\/api\/v1\/my-view-history/, {
    body: mockViewHistoryEmpty
  }).as("getEmptyViewHistory");

  cy.visit("/user-cabinet/view-history");
  cy.wait("@getEmptyViewHistory");
});

Then("The product card should no longer be visible", () => {
  cy.get('[data-cy="product-card"]').should("not.exist");
});

Then("The product count should show {string}", (countText: string) => {
  cy.get('[data-cy="products-count"]').should("contain", countText);
});

Then("The fallback should be shown", () => {
  cy.get('[data-cy="view-history-fallback"]').should("be.visible");
});

When("The user clicks the sort dropdown", () => {
  cy.get('[data-cy="products-dropdown"]').click();
});

Then("The {string} option should be visible", (criteria: string) => {
  cy.contains(criteria).should("be.visible");
});

When("The user clicks Clear All button", () => {
  cy.get('[data-cy="delete-all-products"]').click();
});

Then("Modal confirm should be visible", () => {
  cy.get('[data-cy="confirm-modal"]').should("be.visible");
});

Then("Modal confirm should NOT be visible", () => {
  cy.get('[data-cy="confirm-modal"]').should("not.exist");
});

Then("The user clicks Close button", () => {
  cy.get('[data-cy="close-button"]').click();
});

Then("The user clicks Clear button in modal", () => {
  cy.intercept(httpMethod.delete, /\/api\/v1\/my-view-history/, {
    statusCode: 204
  }).as("deleteAllProducts");

  cy.intercept(httpMethod.get, /\/api\/v1\/my-view-history/, {
    body: mockViewHistoryEmpty
  }).as("getEmptyViewHistory");

  cy.get('[data-cy="clear-button"]').click();
  cy.wait("@deleteAllProducts");
  cy.wait("@getEmptyViewHistory");
});
