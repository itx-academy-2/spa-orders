/// <reference types="cypress" />

import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I can see orders button on a header", () => {
  cy.get('[data-cy="header.orders-item"]').should("be.visible");
});

When("I click on the orders button", () => {
  cy.get('[data-cy="header.orders-item"]').click();
});

Then("I can see orders page", () => {
  cy.get("h1").contains("Your orders").should("be.visible");
});
