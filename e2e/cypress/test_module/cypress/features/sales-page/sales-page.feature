Feature: Sales Page

  Background: Sales page background
    Given I am on the sales page

  Scenario: Displaying products on sale
    When products on sale have finished loading
    Then I should see three products on sale
    And I should see products on sale counter

  Scenario: Displaying loading while products are loaded
    When products are loading
    Then I should see three loading skeletons

  Scenario: Error during products loading
    Given an error occurred during product loading
    Then the error fallback message should be displayed

  Scenario: Navigating to the next page of products
    When I navigate to the next page of products on sale
    Then the next page of products on sale should be displayed

  Scenario: Navigating to the previous page of products
    Given I am on the 2 page of products on sale
    When I navigate to the previous page of products on sale
    Then the previous page of products on sale should be displayed

  Scenario: Navigating to the specific page of products
    When I navigate to page 2 of products on sale
    Then the 2 page of products on sale should be displayed
