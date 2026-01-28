/// <reference types="cypress" />

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I look above the products section", () => {
    cy.get('.spa-products-page__info').should("be.visible");
});

Then("I see Filters button", () => {
    cy.getById("filters-button").should("exist").and("be.visible")
});

When("I click on the 'Filters' button", () => {
    cy.getById("filters-button").click();
});

Then("Drawer opens", () => {
    cy.get('[data-cy="products-filters-drawer"]').should("be.visible");
});

Given("The filters drawer is open", () => {
    cy.getById("filters-button").click();
});

When("I enable 'Discounted items' filter", () => {
    cy.get('[data-cy="discount-filter-checkbox"]').should('not.be.checked')
    cy.get('[data-cy="non-discount-filter-checkbox"]').click({ force: true });
});

When("I click on 'Apply' button", () => {
    cy.get('[data-cy="apply-filters-button"]').click();
});

Then("Only discounted products are displayed", () => {
    cy.get('[data-cy="product-card"]').each(card => {
    cy.wrap(card)
      .find('[data-testid="discount-label"]')
      .should('exist');
  });
});

Given("Some filters are applied", () => {
    cy.get('[data-cy="price-range-from"]').clear().type('10');
    cy.get('[data-cy="apply-filters-button"]').click();
});

When("I click on 'Reset' button", () => {
    cy.get('[data-cy="reset-filters-button"]').click();
});

Then("Drawer closes", () => {
    cy.get('[data-cy="products-filters-drawer"]').should("not.be.visible");
});

Given("I am on the All Products page", () => {
    cy.visitWithLanguage('/products');
});

Then("I see Categories section", () => {
    cy.get('[data-cy="categories-filter-checkbox"]').should("exist").and("be.visible");
});

Given("I am on the {string} page", (category: string) => {
    cy.visitWithLanguage(`/products?category=${category}`);
});

Then("I don't see Categories section", () => {
    cy.get('[data-cy="categories-filter-checkbox"]').should("not.exist");
});