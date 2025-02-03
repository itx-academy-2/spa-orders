import "cypress-mochawesome-reporter/register";
import "cypress-xpath";
import "cypress-commands";

import "@cypress/code-coverage/support";

import "@cypress-e2e/support/commands";
import { ROLES } from "@cypress-e2e/fixtures/global-data";

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

declare global {
  namespace Cypress {
    interface ResolvedConfigOptions {
      apiBaseUrl: string;
      password: string;
      username: string;
    }

    interface Chainable {
      loginWithRole(role?: UserRole): Chainable<JQuery<void>>;

      getById(id: string): Chainable<JQuery<HTMLElement>>;

      getProductsWithQuantity(quantity: number): Chainable<void>;

      getProductsServerError(quantity: number): Chainable<void>;

      getProductsLoading(quantity: number): Chainable<void>;

      visitWithLanguage(url: string, language?: string): Chainable<void>;

      typeIntoBlank(
        element: Cypress.Chainable<JQuery<HTMLElement>>,
        text: string
      ): Cypress.Chainable<JQuery<HTMLElement>>;

      getByLabel(value: string | number): Chainable<JQuery<HTMLElement>>;

      getByData(
        name: string,
        value: string | number
      ): Chainable<JQuery<HTMLElement>>;
    }
  }
}
