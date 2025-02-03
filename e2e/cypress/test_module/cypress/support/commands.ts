import { httpMethod, httpStatusCode } from "@cypress-e2e/fixtures/global-data";
import "cypress-wait-until";
import { checkUserDetailsInLocalStorage } from "@cypress-e2e/support/helpers";

Cypress.Commands.addQuery("getById", (id: string) => {
  const getFn = cy.now(
    "get",
    `[data-cy="${id}"]`
  ) as () => Promise<HTMLElement>;
  return () => getFn();
});

Cypress.Commands.add(
  "typeIntoBlank",
  (element: Cypress.Chainable<JQuery<HTMLElement>>, text: string) => {
    if (!text) {
      return element.clear();
    } else {
      return element.clear().type(text);
    }
  }
);

Cypress.Commands.addQuery("getByData", (name: string, value: string) => {
  const getFn = cy.now(
    "get",
    `[data-${name}="${value}"]`
  ) as () => Promise<HTMLElement>;
  return () => getFn();
});

Cypress.Commands.addQuery("getByLabel", (value: string) => {
  const getFn = cy.now(
    "get",
    `[aria-label="${value}"]`
  ) as () => Promise<HTMLElement>;
  return () => getFn();
});

Cypress.Commands.add("loginWithRole", (role = "ROLE_USER") => {
  cy.clearLocalStorage();

  const email = Cypress.env(`${role}_EMAIL`);
  const password = Cypress.env(`${role}_PASSWORD`);

  cy.intercept("POST", "/api/auth/sign-in").as("loginRequest");

  cy.visitWithLanguage("/");
  cy.getById("auth-button").click();
  cy.getById("auth-email").click().type(email);
  cy.getById("auth-password").click().type(password, { log: false });
  cy.getById("auth-signin-submit").click();

  cy.wait("@loginRequest").then(() => {
    cy.window()
      .its("localStorage")
      .invoke("getItem", "spa-user-details")
      .then((value) => {
        const userDetails = value ? JSON.parse(value) : null;
        if (userDetails) {
          checkUserDetailsInLocalStorage(value, role);
        } else {
          cy.wait(1000);
          cy.window()
            .its("localStorage")
            .invoke("getItem", "spa-user-details")
            .then((retryValue) => {
              checkUserDetailsInLocalStorage(retryValue, role);
            });
        }
      });

    cy.getById("snackbar").should("contain", "You successfully signed in");
  });
});

Cypress.Commands.add("getProductsWithQuantity", (quantity) => {
  cy.intercept(
    httpMethod.get,
    `/api/v1/products?page=0&size=${quantity}&lang=en&tags=`
  ).as("getProductsWithQuantityRequest");
});

Cypress.Commands.add("getProductsServerError", (quantity) => {
  cy.intercept(
    httpMethod.get,
    new RegExp(
      `\/api\/v1\/products\\?tags=&page=0&size=${quantity}(?:&.*)?&lang=en`
    ),
    {
      statusCode: httpStatusCode.internalServerError
    }
  ).as("getProductsRequestServerError");
});

Cypress.Commands.add("getProductsLoading", (quantity) => {
  cy.intercept(
    httpMethod.get,
    `/api/v1/products?page=0&size=${quantity}&lang=en&tags=`,
    (req) => {
      req.continue((res) => {
        res.send({
          statusCode: httpStatusCode.ok,
          body: {
            products: []
          }
        });
      });
    }
  ).as("getProductsRequestLoading");
});

Cypress.Commands.add("visitWithLanguage", (url, language = "en-US") => {
  cy.visit(url, {
    onBeforeLoad: (win) => {
      Object.defineProperty(win.navigator, "language", {
        value: language,
        configurable: true
      });
    }
  });
});
