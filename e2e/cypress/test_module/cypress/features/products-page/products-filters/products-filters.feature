Feature: | Filters |
    Verify that products page works correctly

    Background: Products page context
        Given The user is on the products page

    Scenario: User sees filters button
        When I look above the products section
        Then I see Filters button

    Scenario: User opens filters button
        When I click on the 'Filters' button
        Then Drawer opens

    Scenario: User filters products by discount
        Given The filters drawer is open
        When I turn off the 'Non-discounted items' filter
        And I click on 'Apply' button
        Then Only discounted products are displayed

    Scenario: User resets filters and close drawer
        Given The filters drawer is open
        And Some filters are applied
        And The filters drawer is open
        When I click on 'Reset' button
        Then Drawer closes

    Scenario: User can filter by categories only on All Products page
        Given I am on the All Products page
        And The filters drawer is open
        Then I see Categories section

    Scenario Outline: User cannot filter by categories on other pages
        Given I am on the '<category>' page
        And The filters drawer is open
        Then I don't see Categories section

    Examples:
        | category |
        | computer |
        | tablet   |
        | mobile   |

