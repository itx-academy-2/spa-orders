Feature: Theme switching between light and dark mode

  Scenario: The user switches from light to dark theme and it persists
    Given I visit the homepage
    And I should see "light" theme
    When I toggle the theme switch
    And I should see "dark" theme
    When I reload the page
    Then I should see "dark" theme
