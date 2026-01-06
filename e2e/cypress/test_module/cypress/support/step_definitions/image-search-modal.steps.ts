/// <reference types="cypress" />

import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I have opened the Image Search modal", () => {
    cy.getById("product-form-image-search-button").click();
});

When("I search images with typing keyword 'Smartphone'", () => {
    cy.get('[data-cy="image-search-input"]')
        .should("be.visible")
        .clear()
        .type("Smartphone");
});

Then("I see search results", () => {
    cy.getById("image-search-results")
        .children()
        .should("have.length", 8);
});

When("I search images with suggested keyword 'Laptop'", () => {
    cy.get('[data-cy="image-search-input"]')
        .should("be.visible")
        .clear();
    cy.getById("suggested-keywords").contains("Laptop").click();
});

Then("the loader is visible", () => {
    cy.get('[data-testid="image-search-loader"]').should("be.visible");
});

When("I select an image from the search results", () => {
    cy.getById("image-search-results")
        .children()
        .first()
        .click();
});

Then("the image is marked as selected", () => {
    cy.getById("image-search-results")
        .children()
        .first()
        .should("have.attr", "data-cy", "selected-image");
});

Then("the Confirm button becomes enabled", () => {
    cy.getById("image-search-confirm-button").should("not.be.disabled");
});

When("I confirm the image selection", () => {
    cy.getById("image-search-confirm-button").click();
});

Then("the selected image is shown in the Image preview section", () => {
    cy.get('[data-testid="product-form-image-preview"]')
    .should("be.visible")
    .and("have.prop", "tagName")
    .should("eq", "IMG");
});

When("I deselect the image", () => {
    cy.getById("image-search-results")
        .children()
        .first()
        .click();
});

Then("no image is selected", () => {
    cy.getById("image-search-results")
        .children()
        .first()
        .should("not.have.attr", "data-cy", "selected-image");
});

When("I click on the Close icon", () => {
    cy.get('[data-testid="close-icon"]').click();
});

Then("the modal is closed", () => {
    cy.getById("image-search-modal").should("not.exist");
});