import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { httpMethod } from "@cypress-e2e/fixtures/global-data";

Given("I am on the sales page", () => {
  cy.visit("/products/sales");
  cy.intercept(httpMethod.get, /products\/sales/).as("base-sales-req");
});

Given("I am on the {int} page of products on sale", (page: number) => {
  cy.visit(`/products/sales?page=${page}`);
});

Then("I should see products on sale counter", () => {
  cy.get("body").contains("8 for sale");
});

When("products on sale have finished loading", () => {
  cy.wait("@base-sales-req");
});

Then("I should see three products on sale", () => {
  cy.getById("product-card").should("have.length", 3);
});

When("products are loading", () => {
  cy.getById("product-card").should("have.length", 0);
});

Then("I should see three loading skeletons", () => {
  cy.getById("product-skeleton").should("have.length", 3);
});

When("an error occurred during product loading", () => {
  cy.intercept(httpMethod.get, /products\/sales/, {
    forceNetworkError: true
  }).as("sales-req");
});

Then("the error fallback message should be displayed", () => {
  cy.getById("products-error-label").should("be.visible");
});

When("I navigate to the previous page of products on sale", () => {
  cy.get(`[aria-current="true"]`).invoke("text").as("initial-page");

  cy.get("@initial-page").then((page) => {
    const pageRequestRegex = new RegExp("page=" + (Number(page) - 2));

    cy.intercept(httpMethod.get, pageRequestRegex).as("sales-req");
  });

  cy.getByLabel("Go to previous page").click();
});

Then("the previous page of products on sale should be displayed", () => {
  cy.wait("@sales-req");

  cy.get("@initial-page").then((page) => {
    cy.getByData("current-page", Number(page));
  });
});

When("I navigate to page {int} of products on sale", (page: number) => {
  const pageRequestRegex = new RegExp("page=" + (page - 1));

  cy.intercept(httpMethod.get, pageRequestRegex).as("sales-req");
  cy.getByLabel(`Go to page ${page}`).click();
});

Then(
  "the {int} page of products on sale should be displayed",
  (page: number) => {
    cy.wait("@sales-req");
    cy.getByData("current-page", page);
  }
);

When("I navigate to the next page of products on sale", () => {
  cy.get(`[aria-current="true"]`).invoke("text").as("initial-page");

  cy.get("@initial-page").then((page) => {
    const pageRequestRegex = new RegExp("page=" + page);
    cy.intercept(httpMethod.get, pageRequestRegex).as("sales-req");
  });

  cy.getByLabel("Go to next page").click();
});

Then("the next page of products on sale should be displayed", () => {
  cy.wait("@sales-req");

  cy.get("@initial-page").then((page) => {
    cy.getByData("current-page", String(page));
  });
});
