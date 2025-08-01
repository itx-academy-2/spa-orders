Feature: View History

    Background:
        Given I authenticate to the system under role ROLE_USER

    Scenario: Removing a single product from view history
        Given The view history page is loaded with 1 products
        When The user clicks the delete icon on that product card
        And The view history page is loaded with an empty list
        Then The product card should no longer be visible
        And The product count should show "0 viewed products"
        And The fallback should be shown

    Scenario: Delete all products from view history
        Given The view history page is loaded with 3 products
        When The user clicks Clear All button
        Then Modal confirm should be visible
        When The user clicks Close button
        Then Modal confirm should NOT be visible
        When The user clicks Clear All button
        And The user clicks Clear button in modal
        Then The fallback should be shown

    Scenario: Fallback is shown when view history is empty
        Given The view history page is loaded with an empty list
        Then The fallback should be shown



    Scenario Outline: Verify sorting options are present and visible
        Given The view history page is loaded with an empty list
        When The user clicks the sort dropdown
        Then The "<criteria>" option should be visible

        Examples:
            | criteria |
            | Newest   |
            | Oldest   |
