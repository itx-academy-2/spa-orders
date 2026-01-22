Feature: | Filters |
    Verify that products page works correctly

    Background: Products page context
        Given The user is on the products page

    Scenario: User sees filters button
        When I look above the products section
        Then I see Filters button

    Scenario: User open filters button
        When I click on the 'Filters' button
        Then I see drawer opens

    Scenario Outline: User see drawer section
        Given The filters drawer is open
        Then I see "<section>" section

        Examples:
            | section      |
            | categories   |
            | discount     |
            | price        |
            | availability |
            | delivery     |


