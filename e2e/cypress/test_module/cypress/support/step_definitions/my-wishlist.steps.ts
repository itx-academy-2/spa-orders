/// <reference types="cypress" />

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { httpMethod } from "@cypress-e2e/fixtures/global-data";

Given("I am on the All Products page", () => {
  cy.visit("/products");
});

When("I click on the outlined heart icon on the first product to add to My Wishlist", () => {
  cy.get("[data-cy='product-card']")
    .first()
    .within(() => {
      cy.get("[data-cy='add-to-wishlist-button']").then($btn => {
        if (!$btn.hasClass("spa-product-card__favorite-button--active")) {
          cy.wrap($btn).click();
        }
      });
    });

  cy.intercept(httpMethod.put, /\/api\/v1\/my-wishlist\/.*/);
});

Then("I should see a filled heart icon on the first product", () => {
  cy.get("[data-cy='product-card']")
    .first()
    .within(() => {
      cy.get("[data-cy='add-to-wishlist-button']")
        .should("have.class", "spa-product-card__favorite-button--active");
    });
});

Given("I ensure the first product is in My Wishlist", () => {
  cy.get("[data-cy='product-card']")
    .first()
    .within(() => {
      cy.get("[data-cy='add-to-wishlist-button']")
        .should("have.class", "spa-product-card__favorite-button--active");
    });
});

When("I click on the filled heart icon on the first product to remove from My Wishlist", () => {
  cy.intercept(httpMethod.delete, /\/api\/v1\/my-wishlist\/.*/);

  cy.get("[data-cy='product-card']")
    .first()
    .within(() => {
      cy.get("[data-cy='add-to-wishlist-button']")
        .should("have.class", "spa-product-card__favorite-button--active")
        .click();
    });
});

Then("I should see an outlined heart icon on the first product", () => {
  cy.get("[data-cy='product-card']")
    .first()
    .within(() => {
      cy.get("[data-cy='add-to-wishlist-button']")
        .should("have.class", "spa-product-card__favorite-button");
    });
});

When("I click on the avatar icon in the header", () => {
  cy.get("[data-cy='header-account-button']").click();
});

When("I click on the My Profile dropdown icon", () => {
  cy.get("[data-cy='header.myProfile-item']").click();
});

When("I click on the My Wishlist link on the left sidebar", () => {
  cy.get("[data-cy='sidebar-wishlist-link']").click();
});

Then("I should see the My Wishlist page", () => {
  cy.get("[data-cy='my-wishlist']").should("exist");
});

Given("I am on the My Wishlist page", () => {
  cy.visit("/user-cabinet/wishlist");
});

Then("I should see the My Wishlist title displayed", () => {
  cy.get("[data-cy='my-wishlist-title']").should("exist");
});

Then("I should see total amount of favorite products displayed", () => {
  cy.get("[data-cy='my-wishlist-count']").should("exist").and("be.visible");
});

Then("I should see sorting options", () => {
  cy.get("[data-cy='my-wishlist-dropdown']").should("exist").and("be.visible");
});

Given("I already have 7 products in My Wishlist", () => {
  cy.get("[data-cy='product-card']").each(($card, index) => {
    if (index < 7) {
      cy.wrap($card)
        .find("[data-cy='add-to-wishlist-button']")
        .then(($btn) => {
          if (!$btn.hasClass("spa-product-card__favorite-button--active")) {
            cy.wrap($btn).click();
          }
        });
    }
  });
});

When("I go to the My Wishlist page", () => {
  cy.visit("/user-cabinet/wishlist");
});

Then("I should see {int} products in My Wishlist", (count: number) => {
  cy.get("[data-cy='my-wishlist-count']").should("contain.text", count.toString());
});

Then("I should see a pagination component", () => {
  cy.get("[data-cy='pagination']").should("exist");
});

When("I click on the next page button", () => {
  cy.get("[data-cy='pagination']")
    .contains("2")
    .click();
});

Then("I should see one product on the second page", () => {
  cy.get("[data-cy='product-card']")
    .should("exist")
    .and("have.length", 1);
});
