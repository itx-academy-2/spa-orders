Feature: | Filters |
    Verify that products page works correctly

    Background: Products page context
        Given The user is on the products page

    Scenario: User sees filters button
        When I look above the products section
        Then I see Filters button

    Scenario: User open filters button
        When I click on the 'Filters' button
        Then Drawer opens

    Scenario: User filters products by discount
        Given The filters drawer is open
        When I enable 'Discounted items' filter
        And I click on 'Apply' button
        Then Only discounted products are displayed

    Scenario: User reset filters and close drawer
        Given The filters drawer is open
        And Some filters are applied
        When The filters drawer is open
        And I click on 'Reset' button
        Then Drawer closes
