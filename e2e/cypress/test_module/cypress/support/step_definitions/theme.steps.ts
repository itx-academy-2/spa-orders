import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I visit the homepage", () => {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.matchMedia = (query) => ({
        matches: query === "(prefers-color-scheme: dark)" ? false : false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false
      });
    }
  });
});

Then("I should see {string} theme", (theme: string) => {
  cy.get("html").should("have.attr", "data-theme", theme);
});

When("I toggle the theme switch", () => {
  cy.get("[data-cy='theme-switcher']").click();
});

When("I reload the page", () => {
  cy.reload();
});
