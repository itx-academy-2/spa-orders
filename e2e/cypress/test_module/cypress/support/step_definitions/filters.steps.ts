/// <reference types="cypress" />

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import {
    productsFilterSections
} from "@cypress-e2e/fixtures/constants";

When("I look above the products section", () => {
    cy.get('.spa-products-page__info').should("be.visible");
});

Then("I see Filters button", () => {
    cy.getById("filters-button").should("exist").and("be.visible")
});

When("I click on the 'Filters' button", () => {
    cy.getById("filters-button").click();
});

Then("I see drawer opens", () => {
    cy.get('[data-cy="products-filters-drawer"]').should("be.visible");
});

Given("The filters drawer is open", () => {
    cy.getById("filters-button").click();
});

Then("I see {string} section", (section: string) => {

    cy.get(`[data-cy="${productsFilterSections[section]}-filter-section"]`)
        .should("be.visible");
});