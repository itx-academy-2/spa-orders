Feature: | Logout |

    Scenario: Success logout as manager
        Given I authenticate to the system under role ROLE_MANAGER
        When I click logout button
        Then I should be logged out


    Scenario: Success logout as user
        Given I authenticate to the system under role ROLE_USER
        When I click account icon in header
        Then I click logout from menu
        Then I should be logged out