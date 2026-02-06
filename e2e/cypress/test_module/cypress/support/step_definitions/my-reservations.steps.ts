/// <reference types="cypress" />

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { httpMethod } from "@cypress-e2e/fixtures/global-data";

const productId = "b8be6872-b25e-4c1a-b845-df2f0150b4f2";

const mockProduct = (id: string, price: number) => ({
    id,
    name: "Laptop Lenovo ThinkPad X1 Carbon Gen 10 (2023) Intel Core i7 1TB SSD Black",
    description: "Screen: 14\" IPS, 1920x1200 / Intel Core i7-1260P",
    status: "AVAILABLE",
    tags: [],
    image: "https://th.bing.com/th/id/OIP.p53peXcbhczyek1fnO3m0gHaHa?rs=1&pid=ImgDetMain",
    price,
    discount: null,
    priceWithDiscount: null,
    percentageOfTotalOrders: null,
});

Given("I am on the Product Details page", () => {
    cy.intercept(httpMethod.get, "**/retail/v1/products/**", {
        statusCode: 200,
        body: mockProduct(productId, 1899),
    });

    cy.intercept(httpMethod.get, "**/retail/v1/my-reservations/**", {
        statusCode: 200,
        body: [],
    });

    cy.visit(`/products/${productId}`);
});

When("I click on the 'Reserve' button", () => {
    cy.intercept(httpMethod.put, "**/retail/v1/my-reservations/**", {
        statusCode: 201,
    });

    cy.getById("reserve-product-button").click();
});

Then("The button changes to 'Reserved'", () => {
    cy.getById("reserve-product-button")
        .should("contain.text", "Reserved");
});

When("I click on the 'Reserved' button", () => {
    cy.intercept(httpMethod.delete, "**/retail/v1/my-reservations/**", {
        statusCode: 200,
    });

    cy.getById("reserve-product-button").click();
});

Then("The button changes back to 'Reserve'", () => {
    cy.getById("reserve-product-button")
        .should("contain.text", "Reserve");
});

Given("My reservations contain 1 product", () => {
    cy.intercept(
        httpMethod.get,
        "**/my-reservations**",
        {
            statusCode: 200,
            body: [
                mockProduct(productId, 1899),
            ],
        }
    );
});

When("I navigated to the My Reservations page", () => {
    cy.visit(`/user-cabinet/reservations`);
});

Then("I should see this reserved product", () => {
    cy.contains(
        "Laptop Lenovo ThinkPad X1 Carbon Gen 10"
    ).should("be.visible");
});

Then("I should see that 1 product is listed", () => {
    cy.getById("my-reservations-products-count")
        .should("contain.text", "1 product");
});

Given("I have products in my reservation near the limit", () => {
    cy.intercept(
        httpMethod.get,
        "**/retail/v1/my-reservations/**",
        {
            statusCode: 200,
            body: [
                mockProduct("b8be2222-b25e-4c1a-b845-df2f0150b4f2", 2000),
                mockProduct("b7be1111-b25e-4c1a-b845-df2f0150b4f2", 2999),
            ],
        }
    );
});

When("I click on the 'Reserve' button to add one more product", () => {
    cy.intercept(httpMethod.put, "**/retail/v1/my-reservations/**", {
        statusCode: 400,
        body: {
            detail: "Reservation total cost limit exceeded: max allowed 5000",
            status: 400,
            title: "Reservation Total Cost Exceeded"
        },
    });

    cy.getById("reserve-product-button").click();
});

Then("I should see a snackbar with the message {string}", (message: string) => {
    cy.getById("snackbar").should("contain", message);
});

Given("I have maximum quantity of products in my reservation", () => {
    cy.intercept(
        httpMethod.get,
        "**/retail/v1/my-reservations/**",
        {
            statusCode: 200,
            body: [
                mockProduct("b8be2222-b25e-4c1a-b845-df2f0150b4f2", 100),
                mockProduct("b8be2232-b25e-4c1a-b845-df2f0150b4f2", 500),
                mockProduct("b7be7777-b25e-4c1a-b845-df2f0150b4f2", 350),
                mockProduct("b7be7177-b25e-4c1a-b845-df2f0150b4f2", 200),
                mockProduct("b7be7887-b25e-4c1a-b845-df2f0150b4f2", 150),
            ],
        }
    );
});

When("I try to add one more of the same product", () => {
    cy.intercept(httpMethod.put, "**/retail/v1/my-reservations/**", {
        statusCode: 400,
        body: {

            detail: "User can reserve maximum 5 products",
            status: 400,
            title: "Reservation Limit Exceeded"
        }
    });

    cy.getById("reserve-product-button").click();
});

Then("I see this product with Reserved label", () => {
    cy.getById("product-card").should("be.visible");
    cy.get('[data-testid="reserved-label"]').should("be.visible");
});
