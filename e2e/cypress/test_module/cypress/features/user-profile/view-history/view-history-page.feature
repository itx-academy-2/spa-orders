Feature: View History

    Background:
        Given I authenticate to the system under role ROLE_USER

    @GS3-72
    Scenario: Removing a single product from view history
        Given The view history page is loaded with 1 products
        When The user clicks the delete icon on first product card
        And The view history page is loaded with an empty list
        And The product count should show "0 viewed products"
        And The fallback should be shown

    @GS3-72
    Scenario: Delete all products from view history
        Given The view history page is loaded with 3 products
        When The user clicks Clear All button
        Then Modal confirm should be "visible"
        And The user clicks Clear button in modal
        Then The fallback should be shown

    @GS3-72
    Scenario: Modal confirm is shown when user clicks Clear All button
        Given The view history page is loaded with 1 products
        When The user clicks Clear All button
        Then Modal confirm should be "visible"
        When The user clicks Close button
        Then Modal confirm should be "not visible"
        When The user clicks Clear All button

    @GS3-72
    Scenario: Fallback is shown when view history is empty
        Given The view history page is loaded with an empty list
        Then The fallback should be shown



    @GS3-72
    Scenario Outline: Verify sorting options are present and visible
        Given The view history page is loaded with an empty list
        When The user clicks the sort dropdown
        Then The "<criteria>" option should be visible

        Examples:
            | criteria |
            | Newest   |
            | Oldest   |
