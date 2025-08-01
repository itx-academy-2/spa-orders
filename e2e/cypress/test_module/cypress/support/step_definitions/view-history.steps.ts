import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const mockViewHistoryWithProduct = {
  totalElements: 1,
  content: [
    {
      id: "39159d74-f9f7-4136-bd7e-f006b34f8cb4",
      name: "Apple iPhone 13 128GB Red Mobile Phone",
      image: "...",
      price: 1000.0,
      priceWithDiscount: 800.0
    }
  ]
};

const mockViewHistoryEmpty = {
  totalElements: 0,
  content: []
};

Given(
  "The view history page is loaded with {int} product(s)",
  (productCount: number) => {
    const products = Array.from({ length: productCount }, (_, index) => ({
      id: `product-id-${index + 1}`,
      name: `Product ${index + 1}`,
      image: "...",
      price: 1000.0,
      priceWithDiscount: 800.0 + index * 10
    }));

    const mockViewHistory = {
      totalElements: productCount,
      content: products
    };

    cy.intercept("GET", "**/retail/v1/my-view-history*", {
      body: mockViewHistory
    }).as("getViewHistory");

    cy.visit("/user-cabinet/view-history");
    cy.wait("@getViewHistory");
  }
);

When("The user clicks the delete icon on that product card", () => {
  cy.intercept("DELETE", "**/retail/v1/my-view-history/*", {
    statusCode: 204
  }).as("deleteProduct");
  cy.get('[data-cy="delete-product-from-history"]').first().click();

  cy.wait("@deleteProduct");
});

Given("The view history page is loaded with an empty list", () => {
  cy.intercept("GET", "**/retail/v1/my-view-history*", {
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
  cy.intercept("DELETE", "**/retail/v1/my-view-history", {
    statusCode: 204
  }).as("deleteAllProducts");

  cy.intercept("GET", "**/retail/v1/my-view-history*", {
    body: mockViewHistoryEmpty
  }).as("getEmptyViewHistory");

  cy.get('[data-cy="clear-button"]').click();
  cy.wait("@deleteAllProducts");
  cy.wait("@getEmptyViewHistory");
});
