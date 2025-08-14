import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { httpMethod } from "@cypress-e2e/fixtures/global-data";
import { interceptGetProducts } from "../helpers";

const mockViewHistoryEmpty = {
  totalElements: 0,
  content: []
};

const viewHistoryRequestPath = /\/api\/v1\/my-view-history/;
const viewHistoryPath = "/user-cabinet/view-history";

Given(
  "The view history page is loaded with {int} product(s)",
  (count: number) => {
    interceptGetProducts(viewHistoryRequestPath, count, "getViewHistory");

    cy.visit(viewHistoryPath);
    cy.wait("@getViewHistory");
  }
);

When("The user clicks the delete icon on first product card", () => {
  cy.intercept(httpMethod.delete, viewHistoryRequestPath, {
    statusCode: 204
  }).as("deleteProduct");
  cy.get('[data-cy="delete-product-from-history"]').first().click();

  cy.wait("@deleteProduct");
});

Given("The view history page is loaded with an empty list", () => {
  cy.intercept(httpMethod.get, viewHistoryRequestPath, {
    body: mockViewHistoryEmpty
  }).as("getEmptyViewHistory");

  cy.visit(viewHistoryPath);
  cy.wait("@getEmptyViewHistory");
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

Then("The {string} option should be visible", (text: string) => {
  cy.contains('[data-cy="dropdown-item"]', text).should("be.visible");
});

When("The user clicks Clear All button", () => {
  cy.get('[data-cy="delete-all-products"]').click();
});

Then("Modal confirm should be {string}", (visibility) => {
  const assertion = visibility === "visible" ? "be.visible" : "not.exist";

  cy.get('[data-cy="confirm-modal"]').should(assertion);
});

Then("The user clicks Close button", () => {
  cy.get('[data-cy="close-button"]').click();
});

Then("The user clicks Clear button in modal", () => {
  cy.intercept(httpMethod.delete, viewHistoryRequestPath, {
    statusCode: 204
  }).as("deleteAllProducts");

  cy.intercept(httpMethod.get, viewHistoryRequestPath, {
    body: mockViewHistoryEmpty
  }).as("getEmptyViewHistory");

  cy.get('[data-cy="save-button"]').click();
  cy.wait("@deleteAllProducts");
  cy.wait("@getEmptyViewHistory");
});
