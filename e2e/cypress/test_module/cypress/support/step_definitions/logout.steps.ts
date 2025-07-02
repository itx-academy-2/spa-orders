/// <reference types="cypress" />

import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I click logout button", () => {
  cy.get("[data-testid='header-logout-button']").click();
});

When("I click account icon in header", () => {
  cy.get('[data-cy="header-account-button"]').click();
});

Then("I click logout from menu", () => {
  cy.get('[data-cy="header.logout-item"]').click();
});

Then("I should be logged out", () => {
  cy.getById("auth-button").should("be.visible");
  cy.get("[data-testid='header-logout-button']").should("not.exist");
});
